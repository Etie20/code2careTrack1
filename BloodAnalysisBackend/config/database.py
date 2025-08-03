from sqlalchemy import create_engine
from config.settings import Settings

class DatabaseManager:
    def __init__(self):
        self.engine = create_engine(Settings.DB_URL)
    
    def get_engine(self):
        return self.engine