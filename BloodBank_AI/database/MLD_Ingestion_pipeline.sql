/*
Ce script est pour la creation de la structure d'une BD destine a la prediction et gestion des stocks de stock pour un
SI d'une structure hospitaliere
@Author: Enlighteen Innovation
@Licence: CC - MIT
*/
-- 1. Table des donneurs
CREATE TABLE donors (
                        donor_id           SERIAL        PRIMARY KEY,
                        full_name          VARCHAR(255)  NOT NULL,
                        gender             VARCHAR(10)   NOT NULL
                            CHECK (gender IN ('M', 'F')),
                        date_of_birth      DATE          NOT NULL,
                        blood_type         VARCHAR(3)    NOT NULL
                            CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
                        contact_number     VARCHAR(30),
                        email              VARCHAR(255)  UNIQUE,
                        occupation         VARCHAR(100),
                        address            TEXT,
                        registration_date  DATE          NOT NULL DEFAULT CURRENT_DATE,
                        last_donation_date DATE,
                        medical_notes      TEXT
);

-- 2. Antécédents médicaux de chaque donneur
CREATE TABLE donor_medical_history (
                                       history_id              SERIAL       PRIMARY KEY,
                                       donor_id                INTEGER      NOT NULL
                                           REFERENCES donors(donor_id)
                                               ON DELETE CASCADE,
                                       screening_date          DATE         NOT NULL,
                                       hemoglobin_level        INTEGER      CHECK (hemoglobin_level BETWEEN 0 AND 25),
                                       weight_kg               NUMERIC(5,2) CHECK (weight_kg > 0),
                                       blood_pressure          VARCHAR(20),
                                       temperature_celsius     NUMERIC(4,1),
                                       infectious_disease_test VARCHAR(255),
                                       screening_status        VARCHAR(20)  CHECK (screening_status IN ('Passed','Deferred','Rejected')),
                                       created_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 3. Unités de sang collectées
CREATE TABLE blood_units (
                             unit_id            SERIAL       PRIMARY KEY,
                             donor_id           INTEGER      NOT NULL
                                 REFERENCES donors(donor_id),
                             collection_date    DATE         NOT NULL,
                             expiration_date    DATE         NOT NULL,
                             blood_type         VARCHAR(3)   NOT NULL,
                             volume_ml          INTEGER      NOT NULL CHECK (volume_ml > 0),
                             component_type     VARCHAR(30)  NOT NULL
                                 CHECK (component_type IN ('Whole Blood','Red Cells','Platelets','Plasma')),
                             storage_location   VARCHAR(100),
                             current_status     VARCHAR(20)  NOT NULL
                                 CHECK (current_status IN ('In Stock','Allocated','Expired','Discarded')),
                             collection_center  VARCHAR(100),
                             medical_history_id INTEGER
                                 REFERENCES donor_medical_history(history_id)
);

-- 4. Transactions d’inventaire (entrée/sortie)
CREATE TABLE inventory_transactions (
                                        transaction_id   SERIAL      PRIMARY KEY,
                                        transaction_type VARCHAR(10) NOT NULL
                                            CHECK (transaction_type IN ('IN','OUT')),
                                        transaction_date DATE        NOT NULL DEFAULT CURRENT_DATE,
                                        reason           VARCHAR(255)
);

-- 5. Personnel (techniciens, médecins, administrateurs…)
CREATE TABLE personnel (
                           personnel_id    SERIAL      PRIMARY KEY,
                           full_name       VARCHAR(255) NOT NULL,
                           gender          VARCHAR(10)  NOT NULL
                               CHECK (gender IN ('M','F','Other')),
                           date_of_birth   DATE         NOT NULL,
                           contact_number  VARCHAR(30),
                           email           VARCHAR(255) UNIQUE,
                           role            VARCHAR(50)  NOT NULL,
                           password_hash   VARCHAR(255) NOT NULL,
                           created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 6. Départements (services hospitaliers)
CREATE TABLE departments (
                             department_id   SERIAL      PRIMARY KEY,
                             department_name VARCHAR(100) NOT NULL UNIQUE,
                             location        VARCHAR(100),
                             description     TEXT
);

-- 7. Historique détaillé des mouvements de chaque unité
CREATE TABLE transaction_history (
                                     history_id          SERIAL      PRIMARY KEY,
                                     inventory_tx_id     INTEGER     NOT NULL
                                         REFERENCES inventory_transactions(transaction_id)
                                             ON DELETE CASCADE,
                                     unit_id             INTEGER     NOT NULL
                                         REFERENCES blood_units(unit_id),
                                     volume_retrieved    INTEGER     NOT NULL CHECK (volume_retrieved > 0),
                                     blood_type          VARCHAR(3)  NOT NULL,
                                     component_type      VARCHAR(30) NOT NULL,
                                     personnel_id        INTEGER
                                         REFERENCES personnel(personnel_id),
                                     department_id       INTEGER
                                         REFERENCES departments(department_id),
                                     recorded_at         TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- 8. Besoins formulés par chaque département
CREATE TABLE department_needs (
                                  need_id        SERIAL      PRIMARY KEY,
                                  department_id  INTEGER     NOT NULL
                                      REFERENCES departments(department_id),
                                  personnel_id   INTEGER     NOT NULL
                                      REFERENCES personnel(personnel_id),
                                  blood_type     VARCHAR(3)  NOT NULL,
                                  component_type VARCHAR(30) NOT NULL,
                                  volume_needed  INTEGER     NOT NULL CHECK (volume_needed > 0),
                                  demand_type    VARCHAR(20) NOT NULL
                                      CHECK (demand_type IN ('Urgent','Normal')),
                                  requested_date DATE        NOT NULL DEFAULT CURRENT_DATE,
                                  due_date       DATE,
                                  status         VARCHAR(20) NOT NULL
                                      CHECK (status IN ('Open','Fulfilled','Cancelled')),
                                  note           TEXT
);

-- 9. Prévisions de demande (pour planning et alertes)
CREATE TABLE demand_forecasts (
                                  forecast_id       SERIAL      PRIMARY KEY,
                                  department_id     INTEGER     REFERENCES departments(department_id),
                                  blood_type        VARCHAR(3)  NOT NULL,
                                  component_type    VARCHAR(30) NOT NULL,
                                  forecast_date     DATE        NOT NULL,
                                  forecast_quantity INTEGER     NOT NULL CHECK (forecast_quantity >= 0),
                                  forecast_start    DATE,
                                  forecast_end      DATE,
                                  confidence_level  NUMERIC(5,2) CHECK (confidence_level BETWEEN 0 AND 1),
                                  model_version     VARCHAR(50)
);

-- 10. Alertes automatiques (gaspillage, pénurie, expiration…)
CREATE TABLE alerts (
                        alert_id      SERIAL      PRIMARY KEY,
                        alert_type    VARCHAR(50) NOT NULL,
                        severity      VARCHAR(10) CHECK (severity IN ('Info','Warning','Critical')),
                        blood_type    VARCHAR(3),
                        component_type VARCHAR(30),
                        message       TEXT        NOT NULL,
                        triggered_on  TIMESTAMP   NOT NULL DEFAULT NOW(),
                        resolved      BOOLEAN     NOT NULL DEFAULT FALSE,
                        resolved_on   TIMESTAMP,
                        resolved_by   INTEGER     REFERENCES personnel(personnel_id)
);
