import pandas as pd

class BloodDataPreprocessor:
    @staticmethod
    def preprocess(raw_df):
        ts_data = raw_df.groupby(['usage_date', 'blood_type', 'component_type', 'department_id']).agg({
            'volume_ml': 'sum',
            'day_of_week': 'first',
            'month': 'first'
        }).reset_index()
        
        ts_data['year'] = ts_data['usage_date'].dt.year
        ts_data['day_of_year'] = ts_data['usage_date'].dt.dayofyear
        
        return pd.get_dummies(
            ts_data, 
            columns=['blood_type', 'component_type', 'department_id']
        )