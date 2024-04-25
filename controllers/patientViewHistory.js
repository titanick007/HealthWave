const connection = require('../database');

const getPatientAppointmentsWithDiagnosis = (req, res) => {
    // Retrieve the user_id from the session
    const userId = req.session.user_id;

    // Query to fetch the patient_id using the user_id
    const getPatientIdQuery = 'SELECT patient_id FROM Patients WHERE user_id = ?';

    connection.query(getPatientIdQuery, [userId], (error, patientResults) => {
        if (error) {
            console.error('Error fetching patient ID:', error);
            return res.status(500).send('Error fetching patient ID');
        }

        // Check if any patient was found
        if (patientResults.length === 0) {
            return res.render('patientViewHistory', { patientName: 'Unknown', appointments: [] });
        }

        const patientId = patientResults[0].patient_id;

        // Query to fetch the patient's appointments where diagnosis is not null
        const getAppointmentsQuery = `
            SELECT A.*, 
                   D.name AS doctor_name,
                   GROUP_CONCAT(P.name) AS medicine_names
            FROM Appointments A
            LEFT JOIN Doctors D ON A.doctor_id = D.doctor_id
            LEFT JOIN Appointment_Medicine AM ON A.appointment_id = AM.appointment_id
            LEFT JOIN Pharmacy P ON AM.medicine_id = P.medicine_id
            WHERE A.patient_id = ? AND A.diagnosis IS NOT NULL
            GROUP BY A.appointment_id
        `;

        connection.query(getAppointmentsQuery, [patientId], (error, appointmentResults) => {
            if (error) {
                console.error('Error fetching patient appointments:', error);
                return res.status(500).send('Error fetching patient appointments');
            }

            const patientAppointments = {
                patientName: req.session.patientName, // Assuming patientName is also stored in the session
                appointments: appointmentResults
            };

            res.render('patientViewHistory', patientAppointments);
        });
    });
};

module.exports = { getPatientAppointmentsWithDiagnosis };
