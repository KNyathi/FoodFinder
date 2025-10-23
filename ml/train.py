import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
from torchvision.datasets import Food101
from torchvision.models import efficientnet_v2_s
import argparse
import os
from datetime import datetime

class Food101Trainer:
    def __init__(self, data_path="./data", batch_size=32, num_workers=4):
        self.data_path = data_path
        self.batch_size = batch_size
        self.num_workers = num_workers
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Create model save directory
        os.makedirs('./models', exist_ok=True)
        
        self.setup_data()
        self.setup_model()
    
    def setup_data(self):
        """Setup data transforms and loaders"""
        # Data augmentation for training
        self.train_transform = transforms.Compose([
            transforms.Resize((384, 384)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        # Minimal transforms for validation
        self.val_transform = transforms.Compose([
            transforms.Resize((384, 384)),
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
        
        self.train_loader = DataLoader(
            self.train_dataset, 
            batch_size=self.batch_size, 
            shuffle=True, 
            num_workers=self.num_workers
        )
        self.val_loader = DataLoader(
            self.val_dataset, 
            batch_size=self.batch_size, 
            shuffle=False, 
            num_workers=self.num_workers
        )
        
        self.class_names = self.train_dataset.classes
        print(f"Loaded {len(self.train_dataset)} training samples")
        print(f"Loaded {len(self.val_dataset)} validation samples")
        print(f"Number of classes: {len(self.class_names)}")
    
    def setup_model(self):
        """Initialize EfficientNetV2 model"""
        print("Initializing EfficientNetV2-S model...")
        self.model = efficientnet_v2_s(pretrained=True)
        
        # Replace classifier for 101 food classes
        in_features = self.model.classifier[1].in_features
        self.model.classifier[1] = nn.Linear(in_features, 101)
        
        self.model = self.model.to(self.device)
        
        # Loss and optimizer
        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = optim.AdamW(self.model.parameters(), lr=1e-4, weight_decay=0.01)
        self.scheduler = optim.lr_scheduler.CosineAnnealingLR(self.optimizer, T_max=20)
    
    def train_epoch(self, epoch):
        """Train for one epoch"""
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
            
            if batch_idx % 100 == 0:
                print(f'Epoch: {epoch} | Batch: {batch_idx}/{len(self.train_loader)} | '
                      f'Loss: {loss.item():.4f} | Acc: {100.*correct/total:.2f}%')
        
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
    
    def train(self, epochs=20):
        """Main training loop"""
        best_acc = 0
        
        for epoch in range(1, epochs + 1):
            print(f'\nEpoch {epoch}/{epochs}')
            print('-' * 50)
            
            # Train
            train_loss, train_acc = self.train_epoch(epoch)
            
            # Validate
            val_acc = self.validate()
            
            # Update scheduler
            self.scheduler.step()
            
            print(f'Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%')
            print(f'Val Acc: {val_acc:.2f}%')
            
            # Save best model
            if val_acc > best_acc:
                best_acc = val_acc
                model_path = self.save_model(epoch, val_acc)
                print(f"New best model saved with accuracy: {val_acc:.2f}%")
        
        print(f"\nTraining completed! Best validation accuracy: {best_acc:.2f}%")
        return model_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--epochs', type=int, default=20)
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--data_path', type=str, default='./data')
    args = parser.parse_args()
    
    trainer = Food101Trainer(
        data_path=args.data_path,
        batch_size=args.batch_size
    )
    
    trainer.train(epochs=args.epochs)
    
    
    
 