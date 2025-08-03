from data.connectors import BloodBankDataConnector
from data.preprocessing import BloodDataPreprocessor
from services.forecasting import ForecastingService
from config.settings import Settings

def main():
    # Initialize components
    data_connector = BloodBankDataConnector()
    preprocessor = BloodDataPreprocessor()
    forecast_service = ForecastingService()
    
    # Load and prepare data
    raw_data = data_connector.load_usage_data()
    processed_data = preprocessor.preprocess(raw_data)
    
    # Train and forecast for all combinations
    for blood_type in Settings.BLOOD_TYPES:
        for component in Settings.COMPONENTS:
            for dept_id in raw_data['department_id'].unique():
                try:
                    # Filter relevant data
                    subset = processed_data[
                        (processed_data[f'blood_type_{blood_type}'] == 1) &
                        (processed_data[f'component_type_{component}'] == 1) &
                        (processed_data[f'department_id_{dept_id}'] == 1)
                    ].copy()
                    
                    if len(subset) < 10:  
                        continue
                    
                    # Prophet model
                    prophet_model = ProphetForecastModel()
                    prophet_model.train(subset.rename(columns={'usage_date': 'ds', 'volume_ml': 'y'}))
                    forecast_service.generate_forecasts(
                        prophet_model, "prophet", blood_type, component, dept_id, Settings.FORECAST_HORIZON_DAYS
                    )
                    
                    # XGBoost model
                    xgboost_model = XGBoostForecastModel()
                    X_test, y_test = xgboost_model.train(subset)
                    mae = xgboost_model.evaluate(X_test, y_test)
                    print(f"MAE for {blood_type} {component} (Dept {dept_id}): {mae:.2f} ml")
                    forecast_service.generate_forecasts(
                        xgboost_model, "xgboost", blood_type, component, dept_id, Settings.FORECAST_HORIZON_DAYS
                    )
                    
                except Exception as e:
                    print(f"Error processing {blood_type} {component} (Dept {dept_id}): {str(e)}")

if __name__ == "__main__":
    main()