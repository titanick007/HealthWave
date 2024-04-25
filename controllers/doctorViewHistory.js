const connection = require('../database');

const getDoctorAppointmentsWithDiagnosis = (req, res) => {
    // Retrieve the user_id from the session
    const userId = req.session.user_id;

    // Query to fetch the doctor's ID using the user_id
    const getDoctorIdQuery = 'SELECT doctor_id FROM Doctors WHERE user_id = ?';

    connection.query(getDoctorIdQuery, [userId], (error, doctorResults) => {
        if (error) {
            console.error('Error fetching doctor ID:', error);
            return res.status(500).send('Error fetching doctor ID');
        }

        // Check if any doctor was found
        if (doctorResults.length === 0) {
            return res.render('error', { message: 'Doctor not found' });
        }

        const doctorId = doctorResults[0].doctor_id;

        // Query to fetch the doctor's appointments where diagnosis is not null
        const getAppointmentsQuery = `
            SELECT A.*, 
                   P.name AS patient_name,
                   GROUP_CONCAT(M.name) AS medicine_names
            FROM Appointments A
            LEFT JOIN Patients P ON A.patient_id = P.patient_id
            LEFT JOIN Appointment_Medicine AM ON A.appointment_id = AM.appointment_id
            LEFT JOIN Pharmacy M ON AM.medicine_id = M.medicine_id
            WHERE A.doctor_id = ? AND A.diagnosis IS NOT NULL
            GROUP BY A.appointment_id
        `;

        connection.query(getAppointmentsQuery, [doctorId], (error, appointmentResults) => {
            if (error) {
                console.error('Error fetching doctor appointments:', error);
                return res.status(500).send('Error fetching doctor appointments');
            }

            const doctorAppointments = {
                doctorName: req.session.doctorName, // Assuming doctorName is also stored in the session
                appointments: appointmentResults
            };

            res.render('doctorViewHistory', doctorAppointments);
        });
    });
};

module.exports = { getDoctorAppointmentsWithDiagnosis };
