const express = require('express');
const handlePatientReg = require('../controllers/newPatient');
const makeAppointment = require('../controllers/makeAppointment');
const viewAppointment = require('../controllers/viewPatientAppointment');
const viewHistory = require('../controllers/patientViewHistory');

const router = express.Router();

router.post('/register',handlePatientReg.patient_register);
router.post('/make_appointment',makeAppointment.schedule_appointment);
router.get('/view-appointments',viewAppointment.displayDetails);

//view medical history
router.get('/view-medical-history',viewHistory.getPatientAppointmentsWithDiagnosis);

module.exports = {router};