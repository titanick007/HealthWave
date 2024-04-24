const connection = require('../database');

const schedule_appointment = (req, res) => {
    const { date, time, doctor, reason } = req.body;
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

        // Check if the requested doctor has other appointments within 20 minutes of the requested time
        const appointmentDateTime = new Date(date + ' ' + time);
        const twentyMinutesEarlier = new Date(appointmentDateTime.getTime() - 20 * 60000); // Convert 20 minutes to milliseconds and subtract from appointment time
        const twentyMinutesLater = new Date(appointmentDateTime.getTime() + 20 * 60000); // Add 20 minutes to appointment time

        connection.query('SELECT * FROM APPOINTMENTS WHERE doctor_id = ? AND appointment_date = ? AND appointment_time BETWEEN ? AND ?', [doctorId, date, twentyMinutesEarlier, twentyMinutesLater], (error, existingAppointments) => {
            if (error) {
                console.error('Error checking existing appointments:', error);
                return res.send('Error in scheduling appointment');
            }

            if (existingAppointments.length > 0) {
                // Doctor has other appointments within 20 minutes of the requested time
                return res.send('The requested doctor has another appointment duirng this time');
            }

            // No conflicting appointments, proceed with scheduling
            // Adding appointment into database
            connection.query('INSERT INTO APPOINTMENTS (patient_id, doctor_id, appointment_date, appointment_time, status, symptoms) VALUES (?, ?, ?, ?, ?, ?)', [patientId, doctorId, date, time, 'pending', reason], (error, appointmentResults) => {
                if (error) {
                    console.log('Error while scheduling appointment: ', error);
                    return res.send('Error in scheduling appointment');
                }

                res.send('<h2>Appointment scheduled successfully</h2><br><a href="/patient-dashboard">Go back to home page</a>');
            });
        });
    });
};

module.exports = { schedule_appointment };
