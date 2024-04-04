const express = require('express');
const connection = require('../database');

const fetchAppointment = (req, res) => {
    return new Promise((resolve, reject) => {
        const curr_user_id = req.session.user_id;
        connection.query('SELECT patient_id FROM PATIENTS WHERE user_id = ?', [curr_user_id], (error, results) => {
            if (error) {
                return reject('Error ' + error);
            }
            if (results.length === 0) {
                return reject('Patient not found in database');
            }
            const patientId = results[0].patient_id;

            const sql_query = `SELECT Appointments.appointment_date, Appointments.appointment_time, Doctors.name AS doctor_name
                                FROM Appointments 
                                JOIN Doctors ON Appointments.doctor_id = Doctors.doctor_id
                                WHERE Appointments.appointment_date >= CURDATE() AND Appointments.patient_id = ?
                                ORDER BY Appointments.appointment_date, Appointments.appointment_time`;
            // Execute the query
            connection.query(sql_query, [patientId], (error, results) => {
                if (error) {
                    console.error('Error fetching upcoming appointments:', error);
                    return reject('Internal Server Error');
                }

                // Resolve with the appointment data
                resolve(results);
            });
        });
    });
}

module.exports = { fetchAppointment };


