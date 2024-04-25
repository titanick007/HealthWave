const connection = require('../database');

const generateBill = (req, res) => {
    const { patientName, appointmentDate, appointmentTime } = req.body;

    // Query to get the patient ID based on the patient name
    const getPatientIdQuery = 'SELECT patient_id FROM Patients WHERE name = ?';

    connection.query(getPatientIdQuery, [patientName], (error, patientResults) => {
        if (error) {
            console.error('Error fetching patient ID:', error);
            return res.status(500).send('Error fetching patient ID');
        }

        // Check if any patient was found
        if (patientResults.length === 0) {
            return res.status(404).send('Patient not found');
        }

        const patientId = patientResults[0].patient_id;

        // Query to fetch the appointment details based on patient ID, date, and time
        const getAppointmentQuery = 'SELECT * FROM Appointments WHERE patient_id = ? AND appointment_date = ? AND appointment_time = ?';

        connection.query(getAppointmentQuery, [patientId, appointmentDate, appointmentTime], (error, appointmentResults) => {
            if (error) {
                console.error('Error fetching appointment details:', error);
                return res.status(500).send('Error fetching appointment details');
            }

            // Check if any appointment was found
            if (appointmentResults.length === 0) {
                return res.status(404).send('Appointment not found');
            }

            const appointment = appointmentResults[0];

            // Check if diagnosis is null
            if (!appointment.diagnosis) {
                return res.status(400).send('Diagnosis not done for this appointment');
            }

            // Query to fetch prescribed medicines for the appointment
            const getPrescribedMedicinesQuery = `
                SELECT Appointment_Medicine.*, Pharmacy.name AS medicine_name, Pharmacy.unit_price
                FROM Appointment_Medicine
                INNER JOIN Pharmacy ON Appointment_Medicine.medicine_id = Pharmacy.medicine_id
                WHERE Appointment_Medicine.appointment_id = ?
            `;

            connection.query(getPrescribedMedicinesQuery, [appointment.appointment_id], (error, medicineResults) => {
                if (error) {
                    console.error('Error fetching prescribed medicines:', error);
                    return res.status(500).send('Error fetching prescribed medicines');
                }

                // Calculate total price including consultancy charge and medicine prices
                let totalPrice = 400; // Consultancy charge
                for (const medicine of medicineResults) {
                    totalPrice += medicine.unit_price * medicine.quantity;
                }

                // Store the billing details
                const billingDate = new Date().toISOString().split('T')[0]; // Current date
                const insertBillingQuery = 'INSERT INTO Billing (appointment_id, total_amt, billing_date) VALUES (?, ?, ?)';

                connection.query(insertBillingQuery, [appointment.appointment_id, totalPrice, billingDate], (error) => {
                    if (error) {
                        console.error('Error inserting billing details:', error);
                        return res.status(500).send('Error generating bill');
                    }

                    // Render the bill using EJS
                    res.render('bill', { appointment, medicineResults, patientName, totalPrice });
                });
            });
        });
    });
};

module.exports = { generateBill };
