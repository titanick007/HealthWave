const express = require('express');
const handleDoctorReg = require('../controllers/newDoctor');
const viewAppointment = require('../controllers/viewDoctorAppointment');
const fetchAppointment = require('../controllers/fetchAppointmentDetails');
const diagnose = require('../controllers/prescribeMeds');
const path = require('path');
const publicDirectoryPath = path.join(__dirname, '..', 'public');

const router = express.Router();


//registering new doctor
router.post('/register',handleDoctorReg.doctor_register);

//view appointments
router.get('/view-appointments',viewAppointment.displayDetails);


//prescribe medicine page
router.get('/select-appointment',fetchAppointment.selectAppointment);
//route to prescieb medicine
router.post('/prescribe-medicine',diagnose.addPrescription);





//first go to select appointment page
router.get('/prescribe-medicine-page',(req,res)=>{
    res.sendFile(publicDirectoryPath+'/select-appointment-diagnosis.html');
})




module.exports = {router};