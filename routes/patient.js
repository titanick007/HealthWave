const express = require('express');
const handlePatientReg = require('../controllers/newPatient');
const makeAppointment = require('../controllers/makeAppointment');

const router = express.Router();

router.post('/register',handlePatientReg.patient_register);
router.post('/make_appointment',makeAppointment.schedule_appointment);

module.exports = {router};