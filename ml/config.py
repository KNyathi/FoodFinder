import os
from dataclasses import dataclass

@dataclass
class TrainingConfig:
    data_path: str = "./data"
    batch_size: int = 32
    num_workers: int = 4
    learning_rate: float = 1e-4
    weight_decay: float = 0.01
    epochs: int = 20
    model_save_dir: str = "./models"

@dataclass
class InferenceConfig:
    model_path: str = None  # Auto-detect latest
    top_k: int = 5
    image_size: int = 384
    host: str = "0.0.0.0"
    port: int = 8001