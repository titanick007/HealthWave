const connection = require('../database');

const schedule_appointment = (req, res) => {
    const { date, time, doctor, reason } = req.body;

    // Accessing the chosen doctor's doctor_id
    const doctorId = parseInt(doctor);
        
        const userId = req.session.user_id;
        // Accessing the user's patient_id
        connection.query('SELECT patient_id FROM PATIENTS WHERE user_id=?', [userId], (error, patientResults) => {
            if (error) {
                console.log('Error:', error);
                return res.send('Error in scheduling appointment');
            }

            if (patientResults.length === 0) {
                console.log('Patient not found');
                return res.send('Error in scheduling appointment');
            }

            const patientId = patientResults[0].patient_id;

            // Adding appointment into database
            connection.query('INSERT INTO APPOINTMENTS (patient_id, doctor_id, appointment_date, appointment_time, status, symptoms) VALUES (?, ?, ?, ?, ?, ?)', [patientId, doctorId, date, time, 'pending', reason], (error, appointmentResults) => {
                if (error) {
                    console.log('Error while scheduling appointment: ', error);
                    return res.send('Error in scheduling appointment');
                }

                res.send('<h2>Appointment scheduled successfully</h2><br><a href="/patient-dashboard">Go back to home page</a>');
            });
        });
    }

module.exports = { schedule_appointment };
