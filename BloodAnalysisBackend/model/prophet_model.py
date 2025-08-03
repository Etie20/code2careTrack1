from prophet import Prophet
from models.base_model import BaseForecastModel

class ProphetForecastModel(BaseForecastModel):
    def __init__(self):
        self.model = None
    
    def train(self, data):
        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False
        )
        self.model.fit(data[['ds', 'y']])
    
    def predict(self, horizon):
        future = self.model.make_future_dataframe(periods=horizon)
        return self.model.predict(future)