const connection = require('../database');

const addPrescription = (req, res) => {
    const { appointmentId, diagnosis, med1, med1Quantity, med2, med2Quantity, med3, med3Quantity } = req.body;
    console.log('Received appointmentId:', appointmentId);
    
    // Start a transaction to ensure data consistency
    connection.beginTransaction(error => {
        if (error) {
            console.error('Error beginning transaction:', error);
            return res.status(500).send('Error beginning transaction');
        }

        // Update the diagnosis for the specific appointment tuple
        const updateDiagnosisQuery = 'UPDATE Appointments SET diagnosis = ? WHERE appointment_id = ?';
        connection.query(updateDiagnosisQuery, [diagnosis, appointmentId], (error, results) => {
            if (error) {
                console.error('Error updating diagnosis:', error);
                return connection.rollback(() => {
                    res.status(500).send('Error updating diagnosis');
                });
            }

            console.log('Diagnosis updated successfully:', results.affectedRows);

            // Define the queries to insert prescribed medicines into Appointment-Medicine table
            const insertMedicineQuery = 'INSERT INTO Appointment_Medicine (appointment_id, medicine_id, quantity) VALUES (?, ?, ?)';
            console.log('insertMedicineQuery:', insertMedicineQuery);

            // Function to insert prescribed medicine and update quantity in pharmacy table
            const insertMedicineAndUpdatePharmacy = (medicineId, quantity) => {
                if (medicineId) {
                    console.log('Inserting medicine:', medicineId, 'Quantity:', quantity);
                    connection.query(insertMedicineQuery, [appointmentId, medicineId, quantity], (error, results) => {
                        if (error) {
                            console.error('Error inserting medicine:', error);
                            return connection.rollback(() => {
                                res.status(500).send('Error inserting medicine');
                            });
                        }
                        console.log('Medicine inserted successfully:', results.affectedRows);

                        // Update quantity available in pharmacy table
                        const updatePharmacyQuery = 'UPDATE Pharmacy SET quantity_available = quantity_available - ? WHERE medicine_id = ?';
                        connection.query(updatePharmacyQuery, [quantity, medicineId], (error, results) => {
                            if (error) {
                                console.error('Error updating pharmacy:', error);
                                return connection.rollback(() => {
                                    res.status(500).send('Error updating pharmacy');
                                });
                            }
                            console.log('Pharmacy updated successfully:', results.affectedRows);
                        });
                    });
                }
            };

            // Insert prescribed medicines into Appointment-Medicine table and update pharmacy
            insertMedicineAndUpdatePharmacy(med1, med1Quantity);
            insertMedicineAndUpdatePharmacy(med2, med2Quantity);
            insertMedicineAndUpdatePharmacy(med3, med3Quantity);

            // Commit the transaction
            connection.commit(error => {
                if (error) {
                    console.error('Error committing transaction:', error);
                    return connection.rollback(() => {
                        res.status(500).send('Error committing transaction');
                    });
                }
                console.log('Transaction committed successfully.');
                res.status(200).send('Prescription added successfully<br> <a href="/doctor-dashboard">Go to pharmacy page</a>');
            });
        });
    });
};

module.exports = { addPrescription };
