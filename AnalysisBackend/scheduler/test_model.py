import os
import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
from transformers import BertTokenizer, BertModel
import json
import warnings
import numpy as np
from tqdm import tqdm
import re

# Suppress warnings (optional)
warnings.filterwarnings("ignore")

class FeedbackDataset(Dataset):
    def __init__(self, data, tokenizer, max_len=256):
        self.data = data
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __getitem__(self, idx):
            # ======================
        # 1. MODEL PREPARATION
        # ======================

        # Define paths
        MODEL_NAME = "bert-base-multilingual-cased"
        LOCAL_MODEL_DIR = "C:/Users/GLC/Desktop/Linnov/code2care/saved_models/bert-base-multilingual-cased"

        URGENCY_KEYWORDS = [
            "urgence", "urgent", "immédiat", "immédiate", "dangereux", "dangereuse",
            "grave", "gravement", "critique", "sérieux", "sérieuse", "important",
            "importante", "désespéré", "désespérée", "désespérément", "danger",
            "à risque", "risqué", "risquée", "mort", "mourir", "décès"
        ]


        # Create directory if it doesn't exist
        os.makedirs(LOCAL_MODEL_DIR, exist_ok=True)

        # Download and save model if not already present
        if not os.path.exists(os.path.join(LOCAL_MODEL_DIR, "config.json")):
            print("Downloading and saving model locally...")
            tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
            model = BertModel.from_pretrained(MODEL_NAME)
            
            tokenizer.save_pretrained(LOCAL_MODEL_DIR)
            model.save_pretrained(LOCAL_MODEL_DIR)
        else:
            print("Loading model from local cache...")

        # ======================
        # 2. DATASET & MODEL CLASSES
        # ======================

        # Constants
        CATEGORY_LABELS = ["temps d'attente", "attitude du personnel", "hygiène", "consultation",
                        "équipement", "facturation et prix", "disponibilité des médicaments", "infrastructure"]
        SENTIMENT_LABELS = ["négatif", "neutre", "positif"]

        # Urgency keywords (in French)
        URGENCY_KEYWORDS = [
            "urgence", "urgent", "immédiat", "immédiate", "dangereux", "dangereuse",
            "grave", "gravement", "critique", "sérieux", "sérieuse", "important",
            "importante", "désespéré", "désespérée", "désespérément", "danger",
            "à risque", "risqué", "risquée", "mort", "mourir", "décès"
        ]

        current_dir = os.getcwd() 
        file_path = os.path.join(current_dir, 'dataset_feedback.json')

        # Load dataset
        with open(file_path, 'r', encoding='utf-8') as file:
            sample_data = json.load(file)
            
        
        # ======================
        # 3. INITIALIZATION
        # ======================

        # Load tokenizer from local
        tokenizer = BertTokenizer.from_pretrained(LOCAL_MODEL_DIR)

        # Create dataset and dataloader
        dataset = FeedbackDataset(sample_data, tokenizer)
        train_dataloader = DataLoader(dataset, batch_size=2, shuffle=True)

        # Initialize model from local path
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = MultiTaskBERT(LOCAL_MODEL_DIR).to(device)
        item = self.data[idx]
        text = item["text"]
        sentiment = SENTIMENT_LABELS.index(item["sentiment"])
        category = [1 if label in item["categories"] else 0 for label in CATEGORY_LABELS]

        encoding = self.tokenizer(
            text, 
            truncation=True, 
            padding="max_length", 
            max_length=self.max_len, 
            return_tensors="pt"
        )
        return {
            "input_ids": encoding["input_ids"].squeeze(),
            "attention_mask": encoding["attention_mask"].squeeze(),
            "sentiment": torch.tensor(sentiment),
            "categories": torch.tensor(category, dtype=torch.float)
        }

    def __len__(self):
        return len(self.data)

class MultiTaskBERT(nn.Module):
    def __init__(self, base_model_path):
        super().__init__()
        
             # 1. MODEL PREPARATION
        # ======================

        # Define paths
        MODEL_NAME = "bert-base-multilingual-cased"
        LOCAL_MODEL_DIR = "C:/Users/GLC/Desktop/Linnov/code2care/saved_models/bert-base-multilingual-cased"

        URGENCY_KEYWORDS = [
            "urgence", "urgent", "immédiat", "immédiate", "dangereux", "dangereuse",
            "grave", "gravement", "critique", "sérieux", "sérieuse", "important",
            "importante", "désespéré", "désespérée", "désespérément", "danger",
            "à risque", "risqué", "risquée", "mort", "mourir", "décès"
        ]


        # Create directory if it doesn't exist
        os.makedirs(LOCAL_MODEL_DIR, exist_ok=True)

        # Download and save model if not already present
        if not os.path.exists(os.path.join(LOCAL_MODEL_DIR, "config.json")):
            print("Downloading and saving model locally...")
            tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
            model = BertModel.from_pretrained(MODEL_NAME)
            
            tokenizer.save_pretrained(LOCAL_MODEL_DIR)
            model.save_pretrained(LOCAL_MODEL_DIR)
        else:
            print("Loading model from local cache...")

        # ======================
        # 2. DATASET & MODEL CLASSES
        # ======================

        # Constants
        CATEGORY_LABELS = ["temps d'attente", "attitude du personnel", "hygiène", "consultation",
                        "équipement", "facturation et prix", "disponibilité des médicaments", "infrastructure"]
        SENTIMENT_LABELS = ["négatif", "neutre", "positif"]

        # Urgency keywords (in French)
        URGENCY_KEYWORDS = [
            "urgence", "urgent", "immédiat", "immédiate", "dangereux", "dangereuse",
            "grave", "gravement", "critique", "sérieux", "sérieuse", "important",
            "importante", "désespéré", "désespérée", "désespérément", "danger",
            "à risque", "risqué", "risquée", "mort", "mourir", "décès"
        ]

        current_dir = os.getcwd() 
        file_path = os.path.join(current_dir, 'dataset_feedback.json')

        # Load dataset
        with open(file_path, 'r', encoding='utf-8') as file:
            sample_data = json.load(file)
            
        
        # ======================
        # 3. INITIALIZATION
        # ======================

        # Load tokenizer from local
        tokenizer = BertTokenizer.from_pretrained(LOCAL_MODEL_DIR)

        # Create dataset and dataloader
        dataset = FeedbackDataset(sample_data, tokenizer)
        train_dataloader = DataLoader(dataset, batch_size=2, shuffle=True)

        # Initialize model from local path
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = MultiTaskBERT(LOCAL_MODEL_DIR).to(device)
        
        
        self.bert = BertModel.from_pretrained(base_model_path)
        self.dropout = nn.Dropout(0.3)
        self.sentiment_head = nn.Linear(self.bert.config.hidden_size, len(SENTIMENT_LABELS))
        self.category_head = nn.Linear(self.bert.config.hidden_size, len(CATEGORY_LABELS))

    def forward(self, input_ids, attention_mask, token_type_ids=None):
        outputs = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids
        )
        pooled = self.dropout(outputs.pooler_output)
        sentiment = self.sentiment_head(pooled)
        categories = self.category_head(pooled)
        return sentiment, categories


# ======================
# 4. TRAINING FUNCTIONS
# ======================

def generate_example_prediction(model, dataset, device):
    
    # ======================
    # 1. MODEL PREPARATION
    # ======================

    # Define paths
    MODEL_NAME = "bert-base-multilingual-cased"
    LOCAL_MODEL_DIR = "C:/Users/GLC/Desktop/Linnov/code2care/saved_models/bert-base-multilingual-cased"

    URGENCY_KEYWORDS = [
        "urgence", "urgent", "immédiat", "immédiate", "dangereux", "dangereuse",
        "grave", "gravement", "critique", "sérieux", "sérieuse", "important",
        "importante", "désespéré", "désespérée", "désespérément", "danger",
        "à risque", "risqué", "risquée", "mort", "mourir", "décès"
    ]


    # Create directory if it doesn't exist
    os.makedirs(LOCAL_MODEL_DIR, exist_ok=True)

    # Download and save model if not already present
    if not os.path.exists(os.path.join(LOCAL_MODEL_DIR, "config.json")):
        print("Downloading and saving model locally...")
        tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
        model = BertModel.from_pretrained(MODEL_NAME)
        
        tokenizer.save_pretrained(LOCAL_MODEL_DIR)
        model.save_pretrained(LOCAL_MODEL_DIR)
    else:
        print("Loading model from local cache...")

    # ======================
    # 2. DATASET & MODEL CLASSES
    # ======================

    # Constants
    CATEGORY_LABELS = ["temps d'attente", "attitude du personnel", "hygiène", "consultation",
                    "équipement", "facturation et prix", "disponibilité des médicaments", "infrastructure"]
    SENTIMENT_LABELS = ["négatif", "neutre", "positif"]

    # Urgency keywords (in French)
    URGENCY_KEYWORDS = [
        "urgence", "urgent", "immédiat", "immédiate", "dangereux", "dangereuse",
        "grave", "gravement", "critique", "sérieux", "sérieuse", "important",
        "importante", "désespéré", "désespérée", "désespérément", "danger",
        "à risque", "risqué", "risquée", "mort", "mourir", "décès"
    ]

    current_dir = os.getcwd() 
    file_path = os.path.join(current_dir, 'dataset_feedback.json')

    # Load dataset
    with open(file_path, 'r', encoding='utf-8') as file:
        sample_data = json.load(file)
        
    
    # ======================
    # 3. INITIALIZATION
    # ======================

    # Load tokenizer from local
    tokenizer = BertTokenizer.from_pretrained(LOCAL_MODEL_DIR)

    # Create dataset and dataloader
    dataset = FeedbackDataset(sample_data, tokenizer)
    train_dataloader = DataLoader(dataset, batch_size=2, shuffle=True)

    # Initialize model from local path
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = MultiTaskBERT(LOCAL_MODEL_DIR).to(device)

    
    """Generate a sample prediction for monitoring"""
    model.eval()
    idx = torch.randint(0, len(dataset), (1,)).item()
    sample = dataset[idx]
    
    with torch.no_grad():
        inputs = {
            'input_ids': sample['input_ids'].unsqueeze(0).to(device),
            'attention_mask': sample['attention_mask'].unsqueeze(0).to(device)
        }
        sent_logits, cat_logits = model(**inputs)
        
        # Decode text
        text = tokenizer.decode(sample['input_ids'], skip_special_tokens=True)
        
        # Get sentiment prediction
        sent_probs = torch.softmax(sent_logits, dim=1).squeeze()
        pred_sent_idx = torch.argmax(sent_probs).item()
        pred_sentiment = SENTIMENT_LABELS[pred_sent_idx]
        sent_confidence = torch.max(sent_probs).item()
        
        # Get category predictions
        cat_probs = torch.sigmoid(cat_logits).squeeze()
        pred_categories = [
            CATEGORY_LABELS[i] 
            for i, prob in enumerate(cat_probs) 
            if prob > 0.5
        ]
        
        # Get true labels
        true_sentiment = SENTIMENT_LABELS[sample['sentiment']]
        true_categories = [
            CATEGORY_LABELS[i] 
            for i, val in enumerate(sample['categories']) 
            if val == 1
        ]
    
    return {
        'text': text,
        'true_sentiment': true_sentiment,
        'pred_sentiment': pred_sentiment,
        'sent_confidence': sent_confidence,
        'true_categories': true_categories,
        'pred_categories': pred_categories
    }

def train_and_evaluate(model, train_dataloader, device, num_epochs=1, learning_rate=2e-5):
    optimizer = AdamW(model.parameters(), lr=learning_rate)
    loss_fn_sentiment = nn.CrossEntropyLoss()
    loss_fn_category = nn.BCEWithLogitsLoss()
    
    history = {
        'loss': [],
        'sentiment_acc': [],
        'category_f1': [],
        'examples': []
    }

    for epoch in range(num_epochs):
        model.train()
        epoch_loss = 0
        sent_correct = 0
        total_samples = 0
        cat_true_pos = 0
        cat_pred_pos = 0
        cat_actual_pos = 0
        
        for batch in tqdm(train_dataloader, desc=f"Epoch {epoch+1}/{num_epochs}"):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            sentiment_labels = batch["sentiment"].to(device)
            category_labels = batch["categories"].to(device)
            
            optimizer.zero_grad()
            sent_logits, cat_logits = model(input_ids, attention_mask)
            
            loss_sent = loss_fn_sentiment(sent_logits, sentiment_labels)
            loss_cat = loss_fn_category(cat_logits, category_labels)
            loss = loss_sent + loss_cat
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item()
            
            # Calculate metrics
            sent_preds = torch.argmax(sent_logits, dim=1)
            sent_correct += (sent_preds == sentiment_labels).sum().item()
            
            cat_preds = (torch.sigmoid(cat_logits) > 0.5)
            cat_true_pos += (cat_preds & category_labels.bool()).sum().item()
            cat_pred_pos += cat_preds.sum().item()
            cat_actual_pos += category_labels.sum().item()
            
            total_samples += len(sentiment_labels)
        
        # Calculate epoch metrics
        avg_loss = epoch_loss / len(train_dataloader)
        sentiment_acc = sent_correct / total_samples
        precision = cat_true_pos / (cat_pred_pos + 1e-8)
        recall = cat_true_pos / (cat_actual_pos + 1e-8)
        category_f1 = 2 * (precision * recall) / (precision + recall + 1e-8)
        
        # Store history
        history['loss'].append(avg_loss)
        history['sentiment_acc'].append(sentiment_acc)
        history['category_f1'].append(category_f1)
        history['examples'].append(generate_example_prediction(model, train_dataloader.dataset, device))
        
        # Print epoch summary
        print(f"\nEpoch {epoch+1} Summary:")
        print(f"Loss: {avg_loss:.4f}")
        print(f"Sentiment Accuracy: {sentiment_acc:.2%}")
        print(f"Category F1: {category_f1:.2%}")
    
    return {
        'model': model,
        'history': history
    }

# ======================
# 5. TRAINING EXECUTION
# ======================

# Train the model
# results = train_and_evaluate(
#     model=model,
#     train_dataloader=train_dataloader,
#     device=device,
#     num_epochs=5,
#     learning_rate=2e-5
# )

# ======================
# 6. INFERENCE
# ======================

def is_urgent_feedback(text, sentiment):
    """Determine if feedback is urgent based on content and sentiment"""
    # Check for negative sentiment
    if sentiment != "négatif":
        return False
    
    # Check for urgency keywords (case insensitive)
    text_lower = text.lower()
    
    URGENCY_KEYWORDS = [
            "urgence", "urgent", "immédiat", "immédiate", "dangereux", "dangereuse",
            "grave", "gravement", "critique", "sérieux", "sérieuse", "important",
            "importante", "désespéré", "désespérée", "désespérément", "danger",
            "à risque", "risqué", "risquée", "mort", "mourir", "décès"
        ]
    for keyword in URGENCY_KEYWORDS:
        if re.search(rf'\b{re.escape(keyword.lower())}\b', text_lower):
            return True
    
    # Check for explicit urgency indicators
    if any(phrase in text_lower for phrase in ["besoin immédiat", "aide immédiate", "tout de suite"]):
        return True
    
    # Check for excessive punctuation (multiple !!!)
    if re.search(r'!{2,}', text):
        return True
    
    return False

def predict(text, model, tokenizer, device):
    dict_theme_candidates = { "temps d'attente": 1, "attitude du personnel": 2,  "hygiène": 3, "consultation": 4, "équipement": 5, "facturation et prix": 6, "disponibilité des médicaments": 7, "infrastructure": 8, "autre": 9}

    model.eval()
    
    inputs = tokenizer(
        text, 
        return_tensors="pt", 
        truncation=True, 
        padding="max_length", 
        max_length=256
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        sent_logits, cat_logits = model(**inputs)

    sent_prob = torch.softmax(sent_logits, dim=1)
    CATEGORY_LABELS = ["temps d'attente", "attitude du personnel", "hygiène", "consultation",
                    "équipement", "facturation et prix", "disponibilité des médicaments", "infrastructure"]
    SENTIMENT_LABELS = ["négatif", "neutre", "positif"]
    sentiment_pred = SENTIMENT_LABELS[torch.argmax(sent_prob).item()]

    cat_probs = torch.sigmoid(cat_logits).squeeze()
    category_pred = [
        
           dict_theme_candidates[CATEGORY_LABELS[i]]

         #, round(prob.item(), 2)
         
        for i, prob in enumerate(cat_probs)
        if prob > 0.5
    ]
    
    # Determine if feedback is urgent
    is_urgent = is_urgent_feedback(text, sentiment_pred)
    
    return {
        "text": text,
        "sentiment": sentiment_pred,
        "categories": category_pred,
        "is_urgent": is_urgent
    }

# def analyze_feedback(text, language):
#     return predict(text, model, tokenizer, device)
    
# # Test prediction

# test_text = "J'ai trouvé l'équipement très intuitif"
# from translate import Translator

# translator = Translator(to_lang="fr")
# text = translator.translate(test_text)

# print(test_text)
# print(text)
# result = predict(text, model, tokenizer, device)

# print("\nPrediction Results:")
# print(f"Text: {result['text']}")
# print(f"Sentiment: {result['sentiment']}")
# print(f"Urgent: {'Yes' if result['is_urgent'] else 'No'}")
# print("Categories:")
# for cat in result["categories"]:
#     print(f"- {cat}")

# # ======================
# # 7. MODEL SAVING
# # ======================

# FINE_TUNED_MODEL_DIR = "C:/Users/GLC/Desktop/Linnov/code2care/saved_models/fine_tuned_bert"
# os.makedirs(FINE_TUNED_MODEL_DIR, exist_ok=True)

# # Save model
# torch.save(model.state_dict(), os.path.join(FINE_TUNED_MODEL_DIR, "pytorch_model.bin"))
# model.bert.config.save_pretrained(FINE_TUNED_MODEL_DIR)
# tokenizer.save_pretrained(FINE_TUNED_MODEL_DIR)

# print(f"\nModel saved to {FINE_TUNED_MODEL_DIR}")