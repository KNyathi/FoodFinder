1. Frontend Stack (NextJS, Typescript, FramerMotion)
2. Backend (FastAPI)
3. ML (EfficientNetV2 model - pretrained on 14 million images from ImageNet (1000 classes). Finetuning on Food-101 Dataset.)

Frontend Development Mode:
Open client directory and type:

  ```
    npm run dev
  ```

Backend Development Mode:
Open server directory and type:

create virutal environment:
  ```
    python3 -m venv venv
  ```

activate virtual environment
  ```
    source venv/bin/activate 
  ```

start server:
 ```
  uvicorn app.main:app --reload --port 8000
 ```

ML:
Open ml directory and type:

create virutal environment:
  ```
    python3 -m venv venv
  ```

activate virtual environment
  ```
    source venv/bin/activate 
  ```

train:
  ```
    python3 train.py --epochs 20 --batch_size 32
  ```

inference:
  ```
    python3 inference.py
  ```

