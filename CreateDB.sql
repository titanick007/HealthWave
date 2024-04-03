-- Create the Hospital database
CREATE DATABASE test_db_Hospital;

-- Use the Hospital database
USE test_db_Hospital;

-- Create the Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'employee', 'administrator') NOT NULL
);

-- Create the Patients table
CREATE TABLE Patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    name VARCHAR(100),
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    address VARCHAR(255),
    contact_number VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create the Doctors table
CREATE TABLE Doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    name VARCHAR(100),
    specialization VARCHAR(255),
    contact_number VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create the Appointments table
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE,
    appointment_time TIME,
    status ENUM('pending', 'confirmed', 'canceled'),
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

-- Create the Prescriptions table
CREATE TABLE Prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT UNIQUE,
    prescription_details TEXT,
    prescription_date DATE,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
);

-- Create the Billing table
CREATE TABLE Billing (
    billing_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    amount DECIMAL(10, 2),
    billing_date DATE,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id)
);
