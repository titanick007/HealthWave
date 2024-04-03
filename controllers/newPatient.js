const bcrypt = require('bcrypt');
const connection = require('../database.js');

const patient_register = (req, res) => {
    const { emailId, password, name, age, gender, address, contact_number } = req.body;
  
    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hashPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('An error occurred while hashing password');
      }
  
      // Insert the patient's username, password, and role into the users table
      const insertUserQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      connection.query(insertUserQuery, [emailId, hashPassword, 'patient'], (error, userResults) => {
        if (error) {
          console.error('Error inserting patient user:', error);
          return res.status(500).send('An error occurred while inserting patient user');
        }
  
        // Get the user ID of the newly registered patient
        const userId = userResults.insertId;
  
        // Insert the patient's details into the patients table
        const insertPatientQuery = 'INSERT INTO patients (user_id, name, age, gender, address, contact_number) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(insertPatientQuery, [userId, name, age, gender, address, contact_number], (error, patientResults) => {
          if (error) {
            console.error('Error inserting patient:', error);
            return res.status(500).send('An error occurred while inserting patient');
          }
          
          // Patient registered successfully
          res.redirect('/patient-dashboard');
        });
      });
    });
  }

module.exports={patient_register};