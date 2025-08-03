import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from datetime import datetime, timedelta

# Connect to PostgreSQL
engine = create_engine('postgresql://user:password@localhost/bloodbank')

def load_blood_usage_data():
    """Load historical blood usage data from Transaction_History"""
    query = """
    SELECT 
        th.transaction_date as usage_date,
        th.blood_type,
        th.component_type,
        th.department_id,
        d.department_name,
        th.volume_ml,
        EXTRACT(DOW FROM th.transaction_date) as day_of_week,
        EXTRACT(MONTH FROM th.transaction_date) as month
    FROM Transaction_History th
    JOIN Departments d ON th.department_id = d.department_id
    WHERE th.transaction_type = 'Outgoing'
    ORDER BY th.transaction_date
    """
    return pd.read_sql(query, engine)

# Load data
df = load_blood_usage_data()
df['usage_date'] = pd.to_datetime(df['usage_date'])
df.head()


def preprocess_data(df):
    """Prepare data for forecasting"""
    # Aggregate daily usage by blood type, component, and department
    ts_data = df.groupby(['usage_date', 'blood_type', 'component_type', 'department_id']).agg({
        'volume_ml': 'sum',
        'day_of_week': 'first',
        'month': 'first'
    }).reset_index()
    
    # Feature engineering
    ts_data['year'] = ts_data['usage_date'].dt.year
    ts_data['day_of_year'] = ts_data['usage_date'].dt.dayofyear
    
    # One-hot encode categorical variables
    ts_data = pd.get_dummies(ts_data, columns=['blood_type', 'component_type', 'department_id'])
    
    return ts_data

ts_data = preprocess_data(df)


from prophet import Prophet

def train_prophet_model(data, blood_type, component, department_id):
    """Train a Prophet model for a specific blood type, component, and department"""
    # Filter data
    subset = data[
        (data['blood_type_' + blood_type] == 1) &
        (data['component_type_' + component] == 1) &
        (data['department_id_' + str(department_id)] == 1)
    ].copy()
    
    # Prophet requires columns 'ds' (date) and 'y' (target)
    subset = subset.rename(columns={'usage_date': 'ds', 'volume_ml': 'y'})
    
    # Train model
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False
    )
    model.fit(subset[['ds', 'y']])
    
    return model

# Example: Train model for A+ Whole Blood in Surgery Department (ID=1)
prophet_model = train_prophet_model(ts_data, 'A+', 'Whole Blood', 1)


from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

def train_xgboost_model(data, blood_type, component, department_id):
    """Train XGBoost with additional features"""
    # Filter data
    subset = data[
        (data['blood_type_' + blood_type] == 1) &
        (data['component_type_' + component] == 1) &
        (data['department_id_' + str(department_id)] == 1)
    ].copy()
    
    # Feature selection
    features = ['day_of_week', 'month', 'year', 'day_of_year']
    X = subset[features]
    y = subset['volume_ml']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Train model
    model = XGBRegressor(
        objective='reg:squarederror',
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"MAE for {blood_type} {component} (Dept {department_id}): {mae:.2f} ml")
    
    return model

# Example: Train XGBoost for B- Plasma in Emergency Department (ID=2)
xgboost_model = train_xgboost_model(ts_data, 'B-', 'Plasma', 2)



def generate_forecasts(model, model_type='prophet', days_ahead=30):
    """Generate forecasts and save to Demand_Forecasts table"""
    if model_type == 'prophet':
        future = model.make_future_dataframe(periods=days_ahead)
        forecast = model.predict(future)
        forecast = forecast[['ds', 'yhat']].rename(columns={'ds': 'date', 'yhat': 'forecast_volume'})
    else:  # XGBoost
        last_date = ts_data['usage_date'].max()
        future_dates = [last_date + timedelta(days=i) for i in range(1, days_ahead+1)]
        future_features = pd.DataFrame({
            'date': future_dates,
            'day_of_week': [d.weekday() for d in future_dates],
            'month': [d.month for d in future_dates],
            'year': [d.year for d in future_dates],
            'day_of_year': [d.timetuple().tm_yday for d in future_dates]
        })
        forecast_volume = model.predict(future_features[['day_of_week', 'month', 'year', 'day_of_year']])
        forecast = pd.DataFrame({'date': future_dates, 'forecast_volume': forecast_volume})
    
    # Save to database
    forecast['forecast_date'] = datetime.now()
    forecast['model_version'] = model_type
    forecast.to_sql('Demand_Forecasts', engine, if_exists='append', index=False)
    return forecast

# Example: Generate forecasts
prophet_forecast = generate_forecasts(prophet_model, model_type='prophet', days_ahead=30)
xgboost_forecast = generate_forecasts(xgboost_model, model_type='xgboost', days_ahead=30)



import matplotlib.pyplot as plt
import seaborn as sns

def plot_forecast(forecast, title):
    """Visualize forecast results"""
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=forecast, x='date', y='forecast_volume')
    plt.title(title)
    plt.xlabel('Date')
    plt.ylabel('Blood Demand (ml)')
    plt.grid(True)
    plt.show()

plot_forecast(prophet_forecast, "Prophet Forecast for A+ Whole Blood (Surgery Dept)")
plot_forecast(xgboost_forecast, "XGBoost Forecast for B- Plasma (Emergency Dept)")



def train_all_models():
    """Train models for all blood types, components, and departments"""
    blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    components = ['Whole Blood', 'RBC', 'Plasma', 'Platelets']
    departments = df['department_id'].unique()
    
    for blood_type in blood_types:
        for component in components:
            for dept in departments:
                print(f"Training model for {blood_type} {component} (Dept {dept})")
                try:
                    prophet_model = train_prophet_model(ts_data, blood_type, component, dept)
                    generate_forecasts(prophet_model, model_type='prophet')
                    
                    xgboost_model = train_xgboost_model(ts_data, blood_type, component, dept)
                    generate_forecasts(xgboost_model, model_type='xgboost')
                except Exception as e:
                    print(f"Error training {blood_type} {component} (Dept {dept}): {str(e)}")

# Run full training pipeline
train_all_models()