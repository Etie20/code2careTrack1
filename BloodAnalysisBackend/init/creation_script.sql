CREATE TABLE Donors (
    donor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    occupation VARCHAR(50),
    address TEXT,
    registration_date DATE NOT NULL,
    last_donation_date DATE,
    medical_notes TEXT
);

CREATE TABLE Donor_Medical_History (
    history_id SERIAL PRIMARY KEY,
    donor_id INT REFERENCES Donors(donor_id),
    screening_date TIMESTAMP NOT NULL,
    hemoglobin_level DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    blood_pressure VARCHAR(10),
    temperature DECIMAL(4,2),
    infectious_disease_test JSONB, -- Stores test results for HIV, HepB, etc.
    screening_status VARCHAR(20) CHECK (screening_status IN ('Passed', 'Failed', 'Pending')),
    notes TEXT
);

CREATE TABLE Blood_Units (
    unit_id VARCHAR(20) PRIMARY KEY,
    donor_id INT REFERENCES Donors(donor_id),
    blood_type VARCHAR(5) NOT NULL,
    collection_date TIMESTAMP NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    volume_ml INT CHECK (volume_ml BETWEEN 400 AND 500),
    component_type VARCHAR(20) CHECK (component_type IN ('Whole Blood', 'RBC', 'Plasma', 'Platelets')),
    storage_location VARCHAR(50),
    current_status VARCHAR(20) CHECK (current_status IN ('Available', 'Reserved', 'Transfused', 'Discarded', 'Expired')),
    screening_id INT REFERENCES Donor_Medical_History(history_id),
    collection_center VARCHAR(50)
);

CREATE TABLE Departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    location VARCHAR(50),
    contact_person VARCHAR(50),
    contact_number VARCHAR(15),
    average_monthly_usage INT
);

CREATE TABLE Personnels (
    personnel_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Admin', 'Doctor', 'Nurse', 'LabTech', 'InventoryManager')),
    department_id INT REFERENCES Departments(department_id)
);

CREATE TABLE Inventory_Transactions (
    transaction_id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('Incoming', 'Outgoing', 'Transfer', 'Disposal')),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_location VARCHAR(50),
    reason TEXT,
    performed_by VARCHAR(50)
);

CREATE TABLE Transaction_History (
    history_id SERIAL PRIMARY KEY,
    volume_ml INT CHECK (volume_ml BETWEEN 400 AND 500),
    component_type VARCHAR(20) CHECK (component_type IN ('Whole Blood', 'RBC', 'Plasma', 'Platelets')),
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    personnel_id INT REFERENCES Personnels(personnel_id),
    inventory_transaction_id INT REFERENCES Inventory_Transactions(transaction_id),
    department_id INT REFERENCES Departments(department_id),
    blood_unit_id VARCHAR(20) REFERENCES Blood_Units(unit_id)
);

CREATE TABLE Demand_Forecasts (
    forecast_id SERIAL PRIMARY KEY,
    forecast_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    blood_type VARCHAR(5) NOT NULL,
    component_type VARCHAR(20) NOT NULL,
    forecast_quantity INT NOT NULL,
    forecast_start_date DATE NOT NULL,
    forecast_end_date DATE NOT NULL,
    confidence_level DECIMAL(3,2),
    model_version VARCHAR(50),
    department_id INT REFERENCES Departments(department_id)
);

CREATE TABLE Department_Needs (
    need_id SERIAL PRIMARY KEY,
    department_id INT REFERENCES Departments(department_id),
    personnel_id INT REFERENCES Personnels(personnel_id),
    blood_type VARCHAR(5) NOT NULL,
    demand_type VARCHAR(5) NOT NULL,
    component_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    note VARCHAR(255) NOT NULL,
    volume_needed INT,
    requested_date TIMESTAMP,
    due_date TIMESTAMP
);

CREATE TABLE Alerts (
    alert_id SERIAL PRIMARY KEY,
    alert_type VARCHAR(30) NOT NULL CHECK (alert_type IN ('Shortage', 'Expiry', 'AbnormalUsage', 'System')),
    severity VARCHAR(10) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    blood_type VARCHAR(5),
    component_type VARCHAR(20),
    message TEXT NOT NULL,
    triggered_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_on TIMESTAMP,
    resolved_by VARCHAR(50)
);

-- Create indexes
CREATE INDEX idx_blood_units_status ON Blood_Units(current_status, expiration_date);
CREATE INDEX idx_blood_units_type ON Blood_Units(blood_type, component_type);
CREATE INDEX idx_transaction_history_date ON Transaction_History(inventory_transaction_id, blood_type);
CREATE INDEX idx_donor_blood_type ON Donors(blood_type);
CREATE INDEX idx_forecasts_dates ON Demand_Forecasts(forecast_start_date, forecast_end_date);