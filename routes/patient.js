const express = require('express');
const handlePatientReg = require('../controllers/newPatient');
const makeAppointment = require('../controllers/makeAppointment');
const viewAppointment = require('../controllers/viewPatientAppointment');
const viewHistory = require('../controllers/patientViewHistory');
const viewBills = require('../controllers/patientViewBills.js');

const router = express.Router();

router.post('/register',handlePatientReg.patient_register);
router.post('/make_appointment',makeAppointment.schedule_appointment);
router.get('/view-appointments',viewAppointment.displayDetails);

//view medical history
router.get('/view-medical-history',viewHistory.getPatientAppointmentsWithDiagnosis);

//view bills of previous appointments
router.get('/view-bills', (req, res) => {
    viewBills.patientViewBills(req, res, (error, bills) => {
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('An error occurred');
        } else {
            // Render bills
            res.render('patientViewBills', { bills });
        }
    });
});



module.exports = {router};