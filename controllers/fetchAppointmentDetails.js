const connection = require('../database');

const selectAppointment = (req, res) => {
    const { patientName, appointmentDate, appointmentTime } = req.query;

    // Query to fetch the patient_id based on the patient name
    const findPatientQuery = 'SELECT patient_id FROM Patients WHERE name = ?';

    // Execute the query to find the patient_id
    connection.query(findPatientQuery, [patientName], (error, patientResults) => {
        if (error) {
            console.error('Error fetching patient ID:', error);
            return res.status(500).send('Error fetching patient ID');
        }

        // Check if any patient was found
        if (patientResults.length === 0) {
            return res.status(404).send('Patient not found');
        }

        const patientId = patientResults[0].patient_id;

        // Query to fetch details of the appointment based on patient ID, date, and time
        const query = 'SELECT * FROM Appointments WHERE patient_id = ? AND appointment_date = ? AND appointment_time = ?';

        // Execute the query using the existing connection
        connection.query(query, [patientId, appointmentDate, appointmentTime], (error, results) => {
            if (error) {
                console.error('Error fetching appointment details:', error);
                res.status(500).send('Error fetching appointment details');
            } else {
                // Check if any rows were returned
                if (results.length === 0) {
                    res.status(404).send('Appointment not found');
                } else {
                    // Render the appointment details page and pass the fetched data
                    res.render('diagnosis', { appointment: results[0], patientName });
                }
            }
        });
    });
};

module.exports = { selectAppointment };
