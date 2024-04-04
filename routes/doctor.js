const express = require('express');
const handleDoctorReg = require('../controllers/newDoctor');
const viewAppointment = require('../controllers/viewDoctorAppointment');


const router = express.Router();


//registering new doctor
router.post('/register',handleDoctorReg.doctor_register);
router.get('/view-appointments',viewAppointment.displayDetails);

module.exports = {router};