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

app = FastAPI(title="Food Recognition ML Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        print("Loading food recognition model...")
        
        # If no specific model path, use the latest or default
        if model_path is None:
            model_path = self.find_latest_model()
        
        if model_path is None or not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        # Load checkpoint
        checkpoint = torch.load(model_path, map_location=self.device)
        
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
        
        print(f"Model loaded successfully from {model_path}")
        print(f"Number of classes: {len(self.class_names)}")
        print(f"Using device: {self.device}")
    
    def find_latest_model(self) -> str:
        """Find the most recent model file in models directory"""
        models_dir = "models"
        if not os.path.exists(models_dir):
            return None
        
        model_files = [f for f in os.listdir(models_dir) if f.endswith('.pth')]
        if not model_files:
            return None
        
        # Sort by modification time and return the latest
        model_files.sort(key=lambda x: os.path.getmtime(os.path.join(models_dir, x)), reverse=True)
        return os.path.join(models_dir, model_files[0])
    
    def preprocess_image(self, image: Image.Image) -> torch.Tensor:
        """Preprocess image for model inference"""
        return self.transform(image).unsqueeze(0).to(self.device)
    
    def predict(self, image_tensor: torch.Tensor, top_k: int = 5) -> List[Dict]:
        """Run model prediction"""
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            top_probs, top_indices = torch.topk(probabilities, top_k)
        
        results = []
        for i in range(top_k):
            results.append({
                "class_id": int(top_indices[0][i]),
                "food_name": self.class_names[top_indices[0][i]],
                "confidence": float(top_probs[0][i]),
                "description": f"This appears to be {self.class_names[top_indices[0][i]].replace('_', ' ')}"
            })
        
        return results

# Initialize model
try:
    model_service = FoodRecognitionModel()
    print("Food recognition service initialized successfully!")
except Exception as e:
    print(f"Failed to initialize model: {e}")
    model_service = None

@app.post("/predict")
async def predict_food(image: UploadFile = File(...), top_k: int = 5):
    """
    Predict food from uploaded image
    """
    if model_service is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and validate image
        image_data = await image.read()
        if len(image_data) == 0:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        image_pil = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Preprocess and predict
        image_tensor = model_service.preprocess_image(image_pil)
        predictions = model_service.predict(image_tensor, top_k=top_k)
        
        return {
            "success": True,
            "predictions": predictions,
            "top_prediction": predictions[0] if predictions else None,
            "model": "efficientnetv2-small",
            "message": f"Found {len(predictions)} potential matches"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    status = "healthy" if model_service is not None else "unhealthy"
    return {
        "status": status,
        "model_loaded": model_service is not None,
        "device": str(model_service.device) if model_service else "none"
    }

@app.get("/classes")
async def get_classes():
    """Get list of all food classes"""
    if model_service is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "classes": model_service.class_names,
        "total_classes": len(model_service.class_names)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)