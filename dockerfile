# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Set environment variable to avoid GPU usage
ENV CUDA_VISIBLE_DEVICES=-1

# Install system dependencies required by OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Define the command to run your FastAPI app
CMD ["uvicorn", "fastapi_app:app", "--host", "0.0.0.0", "--port", "7860"]