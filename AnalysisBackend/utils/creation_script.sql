
CREATE TABLE D_Time (
    date_id DATE PRIMARY KEY,
    day INTEGER,
    month INTEGER,
    quarter INTEGER,
    year INTEGER
);

CREATE TABLE D_Recall (
    recall_id INTEGER PRIMARY KEY,
    recall_type VARCHAR(50),
    status VARCHAR(20)
);

CREATE TABLE D_Doctor
(
    doctor_id    serial PRIMARY KEY,
    full_name    varchar(100) not null,
    specialty    varchar(100),
    phone_number varchar(20),
    created_at   timestamp default CURRENT_TIMESTAMP,
    email        VARCHAR(255) NOT NULL,  
    password     text         not null
);

CREATE TABLE D_Theme (
    theme_id INTEGER PRIMARY KEY,
    label VARCHAR(100)
);

CREATE TABLE D_Sentiment (
    sentiment_id INTEGER PRIMARY KEY,
    sentiment VARCHAR(100),
    description VARCHAR(100)
);

CREATE TABLE D_Patient (
    patient_id INTEGER PRIMARY KEY,
    last_name VARCHAR(50),
    first_name VARCHAR(50),
    language VARCHAR(50),
    region VARCHAR(50)
);

CREATE TABLE F_Analysis_Feedback (
    fact_id INTEGER PRIMARY KEY,
    date_id DATE,
    patient_id INTEGER,
    doctor_id INTEGER,
    theme_id INTEGER,
    sentiment_id INTEGER,
    recall_id INTEGER,
    sentiment_score DECIMAL(10,2),
    feedback_count INTEGER,
    
    CONSTRAINT fk_date FOREIGN KEY (date_id) REFERENCES D_Time(date_id),
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES D_Patient(patient_id),
	CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES D_Doctor(doctor_id),
	CONSTRAINT fk_theme FOREIGN KEY (theme_id) REFERENCES D_Theme(theme_id),
    CONSTRAINT fk_sentiment FOREIGN KEY (sentiment_id) REFERENCES D_Sentiment(sentiment_id),
    CONSTRAINT fk_recall FOREIGN KEY (recall_id) REFERENCES D_Recall(recall_id)
);

CREATE INDEX idx_feedback_date ON F_Analysis_Feedback(date_id);
CREATE INDEX idx_feedback_patient ON F_Analysis_Feedback(patient_id);
CREATE INDEX idx_feedback_doctor ON F_Analysis_Feedback(doctor_id);
CREATE INDEX idx_feedback_theme ON F_Analysis_Feedback(theme_id);
CREATE INDEX idx_feedback_sentiment ON F_Analysis_Feedback(sentiment_id);
CREATE INDEX idx_feedback_recall ON F_Analysis_Feedback(recall_id); 