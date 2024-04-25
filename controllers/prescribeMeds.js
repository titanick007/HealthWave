const connection = require('../database');

const addPrescription = (req, res) => {
    const { appointmentId, diagnosis, med1, med1Quantity, med2, med2Quantity, med3, med3Quantity } = req.body;
    console.log('Received appointmentId:', appointmentId);
    // Update the diagnosis for the specific appointment tuple
    const updateDiagnosisQuery = 'UPDATE Appointments SET diagnosis = ? WHERE appointment_id = ?';
    console.log('updateDiagnosisQuery:', updateDiagnosisQuery); // Log the update query
    connection.query(updateDiagnosisQuery, [diagnosis, appointmentId], (error, results) => {
        if (diagnosis) {
            if (error) {
                console.error('Error updating diagnosis:', error);
                return res.status(500).send('Error updating diagnosis');
            }
            console.log('Diagnosis updated successfully:', results.affectedRows); // Log number of affected rows
            // Define the queries to insert prescribed medicines into Appointment-Medicine table
            const insertMedicineQuery = 'INSERT INTO Appointment_Medicine (appointment_id, medicine_id, quantity) VALUES (?, ?, ?)';
            console.log('insertMedicineQuery:', insertMedicineQuery); // Log the insert query
            // Function to insert prescribed medicine
            const insertMedicine = (medicineId, quantity) => {
                if (medicineId) {
                    console.log('Inserting medicine:', medicineId, 'Quantity:', quantity); // Log the medicine details
                    connection.query(insertMedicineQuery, [appointmentId, medicineId, quantity], (error, results) => {
                        if (error) {
                            console.error('Error inserting medicine:', error);
                            return res.status(500).send('Error inserting medicine');
                        }
                        console.log('Medicine inserted successfully:', results.affectedRows); // Log number of affected rows
                    });
                }
            };
            // Insert prescribed medicines into Appointment-Medicine table if not null
            insertMedicine(med1, med1Quantity);
            insertMedicine(med2, med2Quantity);
            insertMedicine(med3, med3Quantity);
            // Send the success message only when diagnosis is not null
            res.status(200).send('Prescription added successfully<br> <a href="/doctor-dashboard">Go to pharmacy page</a>');
        }
    });
};

module.exports = { addPrescription };
