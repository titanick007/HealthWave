const connection = require('../database.js');

function fetchDoctorsFromDatabase() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM doctors';
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching doctors:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

const fetchAppointment = (req, res) => {
    return new Promise((resolve, reject) => {
        const curr_user_id = req.session.user_id;
        connection.query('SELECT doctor_id FROM DOCTORS WHERE user_id = ?', [curr_user_id], (error, results) => {
            if (error) {
                return reject('Error ' + error);
            }
            if (results.length === 0) {
                return reject('Doctor not found in database');
            }
            const doctorId = results[0].doctor_id;

            const sql_query = `SELECT Appointments.appointment_date, Appointments.appointment_time, Appointments.symptoms,Patients.name AS patient_name
                                FROM Appointments 
                                JOIN Patients ON Appointments.patient_id = Patients.patient_id
                                WHERE Appointments.appointment_date >= CURDATE() AND Appointments.doctor_id = ?
                                ORDER BY Appointments.appointment_date, Appointments.appointment_time`;
            // Execute the query
            connection.query(sql_query, [doctorId], (error, results) => {
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

module.exports = {fetchDoctorsFromDatabase,fetchAppointment};
