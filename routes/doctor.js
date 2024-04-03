const express = require('express');
const handleDoctorReg = require('../controllers/newDoctor');

const router = express.Router();


//registering new doctor
router.post('/register',handleDoctorReg.doctor_register);

module.exports = {router};