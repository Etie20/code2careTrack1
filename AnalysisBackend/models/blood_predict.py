import json
import math
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path
from prophet import Prophet
from prophet.serialize import model_from_json
import joblib
import numpy as np

def load_saved_models(model_dir="saved_models", blood_types=['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']):
    """Load all saved Prophet and XGBoost models for each blood type"""
    models = {'prophet': {}, 'xgboost': {}}
    model_dir = Path(model_dir)
    
    for blood_type in blood_types:
        prophet_path = model_dir / f"prophet_{blood_type}.json"
        if prophet_path.exists():
            with open(prophet_path, 'r') as fin:
                models['prophet'][blood_type] = model_from_json(json.load(fin))
        
        xgboost_path = model_dir / f"xgboost_{blood_type}.joblib"
        if xgboost_path.exists():
            models['xgboost'][blood_type] = joblib.load(xgboost_path)
    
    return models
def generate_forecasts(models, forecast_days=7, last_training_date=None):
    """
    Generate AGGREGATED forecasts for all blood types with confidence intervals.
    Returns the TOTAL predicted demand for the entire period.
    """
    if not any(models['prophet'].values()) and not any(models['xgboost'].values()):
        print("\nError: No models available for forecasting!")
        return {}

    if last_training_date is None:
        last_training_date = datetime.now()
        print(f"\nUsing current date ({last_training_date.date()}) as last training date")

    forecasts = {}
    print(f"\nGenerating {forecast_days}-day AGGREGATED forecasts...")

    for blood_type in set(list(models['prophet'].keys())) | set(list(models['xgboost'].keys())):
        print(f"\nProcessing {blood_type}...")
        blood_forecasts = {}

        # Prophet Forecast (Aggregated)
        if blood_type in models['prophet']:
            try:
                prophet_model = models['prophet'][blood_type]
                future = prophet_model.make_future_dataframe(periods=forecast_days)
                forecast = prophet_model.predict(future)
                
                future_forecast = forecast[forecast['ds'] > last_training_date][
                    ['ds', 'yhat', 'yhat_lower', 'yhat_upper']
                ]
                
                # Calculate AGGREGATE values
                prophet_total = {
                    'blood_type': blood_type,
                    'model': 'prophet',
                    'total_predicted_ml': future_forecast['yhat'].sum(),
                    'min_ml': future_forecast['yhat_lower'].sum(),
                    'max_ml': future_forecast['yhat_upper'].sum(),
                    'confidence': 1 - (
                        (future_forecast['yhat_upper'].sum() - future_forecast['yhat_lower'].sum()) / 
                        (2 * future_forecast['yhat'].sum())
                    ),
                    'forecast_days': forecast_days
                }
                blood_forecasts['prophet'] = prophet_total
                print(f"✓ Generated Prophet forecast (Total: {prophet_total['total_predicted_ml']:.0f}ml)")
            except Exception as e:
                print(f"Prophet forecast failed for {blood_type}: {str(e)}")

        # XGBoost Forecast (Aggregated)
        if blood_type in models['xgboost']:
            try:
                xgboost_model = models['xgboost'][blood_type]
                future_dates = [last_training_date + timedelta(days=i) for i in range(1, forecast_days+1)]
                future_features = pd.DataFrame({
                    'day_of_week': [d.weekday() for d in future_dates],
                    'month': [d.month for d in future_dates],
                    'year': [d.year for d in future_dates],
                    'day_of_year': [d.timetuple().tm_yday for d in future_dates],
                    'hemoglobin': 14.0
                })
                
                predictions = xgboost_model.predict(future_features)
                
                xgboost_total = {
                    'blood_type': blood_type,
                    'model': 'xgboost',
                    'total_predicted_ml': predictions.sum(),
                    'min_ml': predictions.sum() * 0.9,  # 10% lower bound
                    'max_ml': predictions.sum() * 1.1,   # 10% upper bound
                    'confidence': 0.8,  # Fixed confidence for XGBoost
                    'forecast_days': forecast_days
                }
                blood_forecasts['xgboost'] = xgboost_total
                print(f"✓ Generated XGBoost forecast (Total: {xgboost_total['total_predicted_ml']:.0f}ml)")
            except Exception as e:
                print(f"XGBoost forecast failed for {blood_type}: {str(e)}")

        if blood_forecasts:
            forecasts[blood_type] = blood_forecasts

    return forecasts

def print_forecasts(forecasts):
    """Print aggregated forecast results"""
    if not forecasts:
        print("\nNo forecasts generated!")
        return
    
    print("\n\nAGGREGATED FORECAST RESULTS:")
    print("="*60)
    
    for blood_type, models in forecasts.items():
        print(f"\nBlood Type: {blood_type}")
        print("="*40)
        
        for model_name, prediction in models.items():
            print(f"\n{model_name.upper()} Forecast ({prediction['forecast_days']}-day total):")
            print("-"*50)
            print(f"Total Predicted Demand: {prediction['total_predicted_ml']:.0f} ml")
            print(f"Expected Range: {prediction['min_ml']:.0f} - {prediction['max_ml']:.0f} ml")
            print(f"Confidence: {prediction['confidence']:.1%}")

def return_forecasts(forecasts):
    results = {}
    for blood_type, models in forecasts.items():
        # Default to Prophet if available, otherwise use XGBoost
        if 'prophet' in models:
            data = models['prophet']
        elif 'xgboost' in models:
            data = models['xgboost']
        else:
            continue
            
        # Convert numpy types to native Python types
        predicted = float(data['total_predicted_ml'])
        min_fc = float(data['min_ml'])
        max_fc = float(data['max_ml'])
        confidence = float(data['confidence']) if not math.isnan(data['confidence']) else None
        
        # Handle cases where prediction is zero (likely missing data)
        if predicted == 0:
            predicted = None
            min_fc = None
            max_fc = None
            confidence = None
        
        results[blood_type] = {
            'predicted_demand': predicted,
            'min_forecast': min_fc,
            'max_forecast': max_fc,
            'confidence': confidence,
            'forecast_days': int(data['forecast_days'])
        }
    
    return results            
# def return_forecasts(forecasts):
#     formatted_forecasts = {}
    
#     for blood_type, models in forecasts.items():
#         # Default to Prophet if available, otherwise use XGBoost
#         if 'prophet' in models:
#             model_data = models['prophet']
#         elif 'xgboost' in models:
#             model_data = models['xgboost']
#         else:
#             continue
            
#         formatted_forecasts[blood_type] = {
#             'predicted_demand': f'{model_data['total_predicted_ml']:.0f}',
#             'min_forecast': f'{model_data['min_ml']:.0f}',
#             'max_forecast': f'{model_data['max_ml']:.0f}',
#             'confidence': f'{model_data['confidence']:.1f}',
#             'forecast_days': f'{model_data['forecast_days']}'
#         }
    
#     return formatted_forecasts
    
# Example Usage
if __name__ == "__main__":
    # 1. Load saved models
    models = load_saved_models()
    
    # 2. Generate 7-day forecasts
    forecasts = generate_forecasts(models, forecast_days=7)
    
    # 3. Print results
    print_forecasts(forecasts)
    print(return_forecasts(forecasts))
    
    # 4. You can also access the raw forecast data:
    # forecasts['A+']['prophet'][0]['predicted_ml']  # gives first day prediction for A+