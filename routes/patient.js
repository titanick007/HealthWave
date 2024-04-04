const express = require('express');
const handlePatientReg = require('../controllers/newPatient');
const makeAppointment = require('../controllers/makeAppointment');
const viewAppointment = require('../controllers/viewPatientAppointment');

const router = express.Router();

router.post('/register',handlePatientReg.patient_register);
router.post('/make_appointment',makeAppointment.schedule_appointment);
router.get('/view-appointments',viewAppointment.displayDetails);

module.exports = {router};