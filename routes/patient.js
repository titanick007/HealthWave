const express = require('express');
const handlePatientReg = require('../controllers/newPatient');

const router = express.Router();

router.post('/register',handlePatientReg.patient_register);

module.exports = {router};