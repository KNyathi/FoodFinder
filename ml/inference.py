from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import numpy as np
import uvicorn

app = FastAPI(title="Food Recognition ML Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Food classes (example - replace with your actual classes)
FOOD_CLASSES = [
    "pizza", "burger", "sushi", "tacos", "pasta", 
    "salad", "steak", "ramen", "curry", "sandwich"
]

# Load your trained model (placeholder function)
def load_model():
    """
    Load your trained food recognition model
    Replace this with your actual model loading logic
    """
    # Example: return a placeholder model
    # In reality, you'd load your .pth or .h5 file here
    class PlaceholderModel:
        def predict(self, image):
            # Mock prediction - replace with actual inference
            scores = np.random.random(len(FOOD_CLASSES))
            scores = scores / scores.sum()  # Convert to probabilities
            return scores
    
    return PlaceholderModel()

model = load_model()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.post("/predict")
async def predict_food(image: UploadFile = File(...)):
    """
    Predict food from uploaded image
    """
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and preprocess image
        image_data = await image.read()
        image_pil = Image.open(io.BytesIO(image_data)).convert('RGB')
        image_tensor = transform(image_pil).unsqueeze(0)
        
        # Predict
        with torch.no_grad():
            predictions = model.predict(image_tensor)
        
        # Get top predictions
        top_indices = np.argsort(predictions)[-3:][::-1]
        results = []
        
        for idx in top_indices:
            results.append({
                "food": FOOD_CLASSES[idx],
                "confidence": float(predictions[idx]),
                "description": f"This appears to be {FOOD_CLASSES[idx]}"
            })
        
        return {
            "predictions": results,
            "top_prediction": results[0] if results else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "ML service healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)