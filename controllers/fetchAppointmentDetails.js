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
        const appointmentQuery = 'SELECT * FROM Appointments WHERE patient_id = ? AND appointment_date = ? AND appointment_time = ?';

        // Execute the query to fetch the appointment details
        connection.query(appointmentQuery, [patientId, appointmentDate, appointmentTime], (error, appointmentResults) => {
            if (error) {
                console.error('Error fetching appointment details:', error);
                return res.status(500).send('Error fetching appointment details');
            }

            // Check if any rows were returned
            if (appointmentResults.length === 0) {
                return res.status(404).send('Appointment not found');
            }

            const appointment = appointmentResults[0];
            const appointmentId = appointment.appointment_id; // Extract appointment_id

            // Query to fetch all available medicines from the pharmacy table
            const pharmacyQuery = 'SELECT * FROM Pharmacy';

            // Execute the query to fetch all available medicines
            connection.query(pharmacyQuery, (error, pharmacyResults) => {
                if (error) {
                    console.error('Error fetching medicines:', error);
                    return res.status(500).send('Error fetching medicines');
                }

                // Render the diagnosis page and pass the fetched data including appointment_id
                res.render('diagnosis', { appointmentId, appointment, patientName, medicines: pharmacyResults });
            });
        });
    });
};

module.exports = { selectAppointment };
