import asyncpg
from datetime import datetime
from typing import Dict

class DBSynchronizer:
    def __init__(self):
        self.last_sync = datetime.min
        self.connection = None

    async def connect(self, config: Dict):
        """Establish a connection to the PostgreSQL database."""
        self.connection = await asyncpg.connect(**config)

    async def insert_donor(self, donor_data: Dict):
        """Insert donor data into the donor table."""
        if self.connection is None:
            raise Exception("Database connection is not established.")

        query = """
        INSERT INTO Donors (full_name, gender, date_of_birth, blood_type,
                           contact_number, email, occupation, adresse,
                           registration_date, last_donation_date, medical_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING donor_id;
        """
        donor_id = await self.connection.fetchval(query, 
            donor_data['full_name'], donor_data['gender'],
            donor_data['date_of_birth'], donor_data['blood_type'],
            donor_data['contact_number'], donor_data['email'],
            donor_data['occupation'], donor_data['adresse'],
            donor_data['registration_date'], donor_data['last_donation_date'],
            donor_data.get('medical_notes')  # Use get for optional field
        )
        return donor_id

    async def close(self):
        """Close the database connection."""
        if self.connection:
            await self.connection.close()