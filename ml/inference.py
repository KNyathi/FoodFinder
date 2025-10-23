from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as transforms
from torchvision.models import efficientnet_v2_s
from PIL import Image
import io
import json
import os
from typing import List, Dict
import uvicorn
import sys

app = FastAPI(title="Food Recognition ML Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FoodRecognitionModel:
    def __init__(self, model_path: str = None):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.class_names = []
        self.transform = None
        self.load_model(model_path)
    
    def load_model(self, model_path: str = None):
        """Load the trained model"""
        print(" Loading food recognition model...")
        
        # If no specific model path, use the latest or default
        if model_path is None:
            model_path = self.find_latest_model()
        
        if model_path is None or not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        print(f"Attempting to load model from: {model_path}")
        
        # Load checkpoint
        checkpoint = torch.load(model_path, map_location=self.device)
        print(f"Checkpoint keys: {list(checkpoint.keys())}")
        
        # Initialize model architecture
        self.model = efficientnet_v2_s(pretrained=False)
        in_features = self.model.classifier[1].in_features
        self.model.classifier[1] = torch.nn.Linear(in_features, 101)
        
        # Load trained weights
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.to(self.device)
        self.model.eval()
        
        # Load class names
        self.class_names = checkpoint.get('class_names', [f"class_{i}" for i in range(101)])
        
        # Setup transforms (must match training)
        self.transform = transforms.Compose([
            transforms.Resize((384, 384)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
   
        print(f"Sample class names: {self.class_names[:5] if self.class_names else 'None'}")
    
    def find_latest_model(self) -> str:
        """Find the most recent model file in models directory"""
        models_dir = "models"
        if not os.path.exists(models_dir):
            print(f"Models directory '{models_dir}' not found!")
            return None
        
        model_files = [f for f in os.listdir(models_dir) if f.endswith('.pth')]
        if not model_files:
            print(f" No .pth files found in '{models_dir}'")
            return None
        
        # Sort by modification time and return the latest
        model_files.sort(key=lambda x: os.path.getmtime(os.path.join(models_dir, x)), reverse=True)
        latest_model = os.path.join(models_dir, model_files[0])
        print(f"Found latest model: {latest_model}")
        return latest_model
    
    def preprocess_image(self, image: Image.Image) -> torch.Tensor:
        """Preprocess image for model inference"""
        print(f"Preprocessing image: {image.size} -> (384, 384)")
        return self.transform(image).unsqueeze(0).to(self.device)
    
    def predict(self, image_tensor: torch.Tensor, top_k: int = 5) -> List[Dict]:
        """Run model prediction"""
        print(f" Running prediction with top_k={top_k}")
        with torch.no_grad():
            outputs = self.model(image_tensor)
            print(f" Model outputs shape: {outputs.shape}")
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            top_probs, top_indices = torch.topk(probabilities, top_k)
        
        print("\n" + "="*60)
        print("FOOD RECOGNITION PREDICTIONS:")
        print("="*60)
        
        results = []
        for i in range(top_k):
            class_id = int(top_indices[0][i])
            confidence = float(top_probs[0][i])
            food_name = self.class_names[class_id] if class_id < len(self.class_names) else f"class_{class_id}"
            confidence_percent = confidence * 100
            
            result = {
                "class_id": class_id,
                "food_name": food_name,
                "confidence": confidence,
                "description": f"This appears to be {food_name.replace('_', ' ')}"
            }
            results.append(result)
            
            # Print each prediction with clear formatting
            print(f" #{i+1}: {food_name.replace('_', ' ').title()}")
            print(f"   Confidence: {confidence_percent:.2f}%")
            print(f"   Class ID: {class_id}")
            print()
        
        print(f" TOP PREDICTION: {results[0]['food_name'].replace('_', ' ').title()} ({results[0]['confidence']*100:.2f}%)")
        print("="*60 + "\n")
        return results

# Initialize model
try:
    print("🎬 Initializing food recognition service...")
    model_service = FoodRecognitionModel()
    print("Food recognition service initialized successfully!")
except Exception as e:
    print(f"Failed to initialize model: {e}")
    import traceback
    traceback.print_exc()
    model_service = None

@app.post("/predict")
async def predict_food(image: UploadFile = File(...), top_k: int = 5):
    """
    Predict food from uploaded image
    """
    print(f"\nNEW PREDICTION REQUEST RECEIVED!")
    print(f"File: {image.filename}")
    print(f"Content-type: {image.content_type}")
    print(f"Top_k: {top_k}")
    
    if model_service is None:
        error_msg = "Model not loaded"
        print(f" ERROR: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
    
    if not image.content_type.startswith('image/'):
        error_msg = "File must be an image"
        print(f" ERROR: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)
    
    try:
        # Read and validate image
        image_data = await image.read()
        print(f"Image size: {len(image_data)} bytes")
        
        if len(image_data) == 0:
            error_msg = "Empty image file"
            print(f"ERROR: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)
        
        image_pil = Image.open(io.BytesIO(image_data)).convert('RGB')
        print(f"Image dimensions: {image_pil.size}, Mode: {image_pil.mode}")
        
        # Preprocess and predict
        image_tensor = model_service.preprocess_image(image_pil)
        print(f"Image tensor shape: {image_tensor.shape}")
        
        predictions = model_service.predict(image_tensor, top_k=top_k)
        
        response = {
            "success": True,
            "predictions": predictions,
            "top_prediction": predictions[0] if predictions else None,
            "model": "efficientnetv2-small",
            "message": f"Found {len(predictions)} potential matches"
        }
        
        print(f" Prediction completed successfully!: ")
        
        return response
        
    except Exception as e:
        error_msg = f"Prediction failed: {str(e)}"
        print(f"ERROR: {error_msg}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    status = "healthy" if model_service is not None else "unhealthy"
    response = {
        "status": status,
        "model_loaded": model_service is not None,
        "device": str(model_service.device) if model_service else "none"
    }
    print(f" Health check: {response}")
    return response

@app.get("/classes")
async def get_classes():
    """Get list of all food classes"""
    print(" Classes endpoint called")
    
    if model_service is None:
        error_msg = "Model not loaded"
        print(f"ERROR: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
    
    response = {
        "classes": model_service.class_names,
        "total_classes": len(model_service.class_names)
    }
    print(f" Classes response: {len(model_service.class_names)} classes")
    print(f" Sample classes: {model_service.class_names[:10]}")
    return response

if __name__ == "__main__":
    print("Starting FastAPI server on http://0.0.0.0:8001")
    # Force flush to ensure prints appear immediately
    sys.stdout.flush()
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False, log_level="info")