const connection = require('../database');

const patientViewBills = (req, res, callback) => {
    // Retrieve the user_id from the session
    const userId = req.session.user_id;

    // Query to fetch the patient's ID using the user_id
    const getPatientIdQuery = 'SELECT patient_id FROM Patients WHERE user_id = ?';

    connection.query(getPatientIdQuery, [userId], (error, patientResults) => {
        if (error) {
            console.error('Error fetching patient ID:', error);
            return callback(error, null); // Pass error to callback
        }

        // Check if any patient was found
        if (patientResults.length === 0) {
            return callback('Patient not found', null); // Pass error to callback
        }

        const patientId = patientResults[0].patient_id;

        // Query to fetch the patient's appointments where diagnosis is not null
        const getAppointmentsQuery = `
            SELECT appointment_id 
            FROM Appointments 
            WHERE patient_id = ? AND diagnosis IS NOT NULL
        `;

        connection.query(getAppointmentsQuery, [patientId], (error, appointmentResults) => {
            if (error) {
                console.error('Error fetching patient appointments:', error);
                return callback(error, null); // Pass error to callback
            }

            if (appointmentResults.length === 0) {
                return callback(null, []); // Pass empty array for bills to callback
            }

            const appointmentIds = appointmentResults.map(result => result.appointment_id);

            // Query to fetch the prescribed medicines for the appointments
            const getMedicinesQuery = `
                SELECT AM.appointment_id, P.name AS medicine_name, P.unit_price, AM.quantity
                FROM Appointment_Medicine AM
                INNER JOIN Pharmacy P ON AM.medicine_id = P.medicine_id
                WHERE AM.appointment_id IN (?)
            `;

            connection.query(getMedicinesQuery, [appointmentIds], (error, medicineResults) => {
                if (error) {
                    console.error('Error fetching prescribed medicines:', error);
                    return callback(error, null); // Pass error to callback
                }

                // Query to fetch billing details for the appointments
                const getBillingQuery = `
                    SELECT * FROM Billing WHERE appointment_id IN (?)
                `;

                connection.query(getBillingQuery, [appointmentIds], (error, billingResults) => {
                    if (error) {
                        console.error('Error fetching billing details:', error);
                        return callback(error, null); // Pass error to callback
                    }

                    // Combine appointment, medicine, and billing details
                    const bills = appointmentResults.map(appointment => {
                        const appointmentId = appointment.appointment_id;
                        const medicines = medicineResults.filter(medicine => medicine.appointment_id === appointmentId);
                        const bill = billingResults.find(bill => bill.appointment_id === appointmentId);
                        return {
                            appointmentId,
                            medicines,
                            bill: {
                                billing_date: bill.billing_date,
                                total_amount: bill.total_amt // Use total_amt field
                            }
                        };
                    });

                    // Pass bills to callback
                    callback(null, bills);
                });
            });
        });
    });
};

module.exports = { patientViewBills };
