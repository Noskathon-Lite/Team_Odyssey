from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import to_categorical

# FastAPI app setup
app = FastAPI()

# Load the pre-trained model
model_path = 'D:/Downloads/potholes/sample.h5'

if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file '{model_path}' not found. Ensure it is available in the working directory.")
model = load_model(model_path)

# Predefined image size for prediction
size = 100

# FastAPI Model for input data
class ImageData(BaseModel):
    image_path: str  # Path to image file

@app.get("/")
async def read_root():
    """
    Root endpoint for checking if the API is running.
    """
    return {"message": "FastAPI app for pothole detection is running successfully!"}

# Prediction Endpoint
@app.post("/predict/")
async def predict(data: ImageData):
    """
    Predict whether the input image is a pothole or not.
    """
    # Validate the image path
    if not os.path.exists(data.image_path):
        raise HTTPException(status_code=400, detail=f"Image file '{data.image_path}' not found.")
    
    try:
        # Load the image and preprocess
        image = cv2.imread(data.image_path, 0)
        if image is None:
            raise ValueError("Failed to read the image. Please check the file format and path.")
        
        image = cv2.resize(image, (size, size))
        image = np.asarray(image).reshape(1, size, size, 1)

        # Make prediction
        prediction = model.predict(image)
        predicted_class = np.argmax(prediction, axis=1)

        # Return prediction result
        return {"predicted_class": int(predicted_class[0])}

    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")
