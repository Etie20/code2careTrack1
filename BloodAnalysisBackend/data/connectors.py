import pandas as pd
from config.database import DatabaseManager

class BloodBankDataConnector:
    def __init__(self):
        self.db = DatabaseManager()
    
    def load_usage_data(self):
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
        return pd.read_sql(query, self.db.get_engine())