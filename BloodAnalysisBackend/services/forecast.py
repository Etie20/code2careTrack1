from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from models.base_model import BaseForecastModel

class XGBoostForecastModel(BaseForecastModel):
    def __init__(self):
        self.model = XGBRegressor(
            objective='reg:squarederror',
            n_estimators=200,
            max_depth=6,
            learning_rate=0.05
        )
    
    def train(self, data):
        X = data[['day_of_week', 'month', 'year', 'day_of_year']]
        y = data['volume_ml']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        self.model.fit(X_train, y_train)
        return X_test, y_test
    
    def evaluate(self, X_test, y_test):
        from sklearn.metrics import mean_absolute_error
        y_pred = self.model.predict(X_test)
        return mean_absolute_error(y_test, y_pred)