import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Subset
import torchvision.transforms as transforms
from torchvision.datasets import Food101
from torchvision.models import efficientnet_v2_s
import argparse
import os
from datetime import datetime
import numpy as np

class Food101Trainer:
    def __init__(self, data_path="./data", batch_size=32, num_workers=4):
        self.data_path = data_path
        self.batch_size = batch_size
        self.num_workers = num_workers
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        print(f"Using device: {self.device}")
        
        # Create model save directory
        os.makedirs('./models', exist_ok=True)
        
        self.setup_data()
        self.setup_model()
    
    def setup_data(self):
        """Setup data transforms with smaller images"""
        image_size = 384
        
        self.train_transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.RandomHorizontalFlip(p=0.3),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        self.val_transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        # Load Food101 dataset
        print("Loading Food101 dataset...")
        self.train_dataset = Food101(
            root=self.data_path, 
            split='train', 
            download=True, 
            transform=self.train_transform
        )
        self.val_dataset = Food101(
            root=self.data_path, 
            split='test', 
            download=True, 
            transform=self.val_transform
        )
        
        # Create subsets - 10% of train, 5% of test
        train_size = len(self.train_dataset)
        val_size = len(self.val_dataset)
        
        train_subset_size = int(0.10 * train_size)
        val_subset_size = int(0.05 * val_size)
        
        # Create random indices for subsets
        train_indices = np.random.choice(train_size, train_subset_size, replace=False)
        val_indices = np.random.choice(val_size, val_subset_size, replace=False)
        
        # Create subset datasets
        self.train_subset = Subset(self.train_dataset, train_indices)
        self.val_subset = Subset(self.val_dataset, val_indices)
        
        # DataLoader without mixed precision (since we're on CPU)
        self.train_loader = DataLoader(
            self.train_subset, 
            batch_size=self.batch_size, 
            shuffle=True, 
            num_workers=self.num_workers
        )
        self.val_loader = DataLoader(
            self.val_subset, 
            batch_size=self.batch_size, 
            shuffle=False, 
            num_workers=self.num_workers
        )
        
        self.class_names = self.train_dataset.classes
        print(f"Using {len(self.train_subset):,} training samples (10%)")
        print(f"Using {len(self.val_subset):,} validation samples (5%)")
        print(f"Number of classes: {len(self.class_names)}")
        print(f"Batch size: {self.batch_size}")
    
    def setup_model(self):
        """Initialize model with proper fine-tuning and better optimizer settings"""
        print("Initializing EfficientNetV2-S model...")
        self.model = efficientnet_v2_s(weights='DEFAULT')
        
        # Replace classifier for 101 food classes
        in_features = self.model.classifier[1].in_features
        self.model.classifier[1] = nn.Linear(in_features, 101)
        
        # FREEZE all layers except the classifier
        for param in self.model.parameters():
            param.requires_grad = False
        
        # UNFREEZE only the classifier
        for param in self.model.classifier.parameters():
            param.requires_grad = True
        
        self.model = self.model.to(self.device)
        
        # Count parameters
        total_params = sum(p.numel() for p in self.model.parameters())
        trainable_params = sum(p.numel() for p in self.model.classifier.parameters())
        print(f"Total parameters: {total_params:,}")
        print(f"Trainable parameters: {trainable_params:,} ({trainable_params/total_params*100:.2f}%)")
        
        # MUCH BETTER OPTIMIZER SETTINGS FOR CPU
        trainable_params = filter(lambda p: p.requires_grad, self.model.parameters())
        self.criterion = nn.CrossEntropyLoss()
        
        # Higher learning rate and simpler optimizer for CPU
        self.optimizer = optim.Adam(trainable_params, lr=1e-2, weight_decay=1e-4)  # 100x higher LR!
        self.scheduler = optim.lr_scheduler.StepLR(self.optimizer, step_size=3, gamma=0.5)
    
    def train_epoch(self, epoch):
        """Train for one epoch - simplified for CPU"""
        self.model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for batch_idx, (images, labels) in enumerate(self.train_loader):
            images, labels = images.to(self.device), labels.to(self.device)
            
            self.optimizer.zero_grad()
            outputs = self.model(images)
            loss = self.criterion(outputs, labels)
            loss.backward()
            self.optimizer.step()
            
            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
            if batch_idx % 10 == 0:  # More frequent updates
                acc = 100. * correct / total
                current_lr = self.optimizer.param_groups[0]['lr']
                print(f'Epoch: {epoch} | Batch: {batch_idx:3d}/{len(self.train_loader)} | '
                      f'Loss: {loss.item():.4f} | Acc: {acc:6.2f}% | LR: {current_lr:.2e}')
        
        epoch_acc = 100. * correct / total
        epoch_loss = running_loss / len(self.train_loader)
        return epoch_loss, epoch_acc
    
    def validate(self):
        """Validate the model"""
        self.model.eval()
        correct = 0
        total = 0
        
        with torch.no_grad():
            for images, labels in self.val_loader:
                images, labels = images.to(self.device), labels.to(self.device)
                outputs = self.model(images)
                _, predicted = outputs.max(1)
                total += labels.size(0)
                correct += predicted.eq(labels).sum().item()
        
        val_acc = 100. * correct / total
        return val_acc
    
    def save_model(self, epoch, accuracy):
        """Save model checkpoint"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"models/food101_effnetv2s_epoch{epoch}_acc{accuracy:.2f}_{timestamp}.pth"
        
        torch.save({
            'epoch': epoch,
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'accuracy': accuracy,
            'class_names': self.class_names
        }, filename)
        
        print(f"Model saved: {filename}")
        return filename
    
    def train(self, epochs=10):
        """Main training loop"""
        best_acc = 0
        start_time = datetime.now()
        
        print(f"\nStarting training at: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Training for {epochs} epochs")
        print(f"Training batches per epoch: {len(self.train_loader)}")
        
        for epoch in range(1, epochs + 1):
            epoch_start = datetime.now()
            print(f'\nEpoch {epoch}/{epochs}')
            print('-' * 50)
            
            # Train
            train_loss, train_acc = self.train_epoch(epoch)
            
            # Validate
            val_acc = self.validate()
            
            # Update scheduler
            self.scheduler.step()
            
            epoch_time = (datetime.now() - epoch_start).total_seconds()
            
            print(f'Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%')
            print(f'Val Acc: {val_acc:.2f}%')
            print(f'Epoch time: {epoch_time:.1f}s')
            
            # Save best model
            if val_acc > best_acc:
                best_acc = val_acc
                model_path = self.save_model(epoch, val_acc)
                print(f"New best model saved with accuracy: {val_acc:.2f}%")
            
            # Early stopping if accuracy is terrible after 3 epochs
            if epoch >= 3 and val_acc < 5.0:
                print(f"Very low accuracy after {epoch} epochs. Consider debugging.")
        
        total_time = (datetime.now() - start_time).total_seconds()
        print(f"\n{'='*50}")
        print(f"Training completed in {total_time/60:.1f} minutes!")
        print(f"Best validation accuracy: {best_acc:.2f}%")
        
        return model_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Fast Food101 Training on CPU')
    parser.add_argument('--epochs', type=int, default=10, help='Number of epochs')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size')
    parser.add_argument('--data_path', type=str, default='./data', help='Data directory')
    parser.add_argument('--workers', type=int, default=4, help='Number of data loader workers')
    parser.add_argument('--seed', type=int, default=42, help='Random seed')
    args = parser.parse_args()
    
    # Set random seed
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)
    
    print("Starting Food101 training (CPU optimized)...")
    print(f"Using 10% of training data and 5% of test data")
    
    trainer = Food101Trainer(
        data_path=args.data_path,
        batch_size=args.batch_size,
        num_workers=args.workers
    )
    
    trainer.train(epochs=args.epochs)