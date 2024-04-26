const express = require('express');
const handleDoctorReg = require('../controllers/newDoctor');
const viewAppointment = require('../controllers/viewDoctorAppointment');
const fetchAppointment = require('../controllers/fetchAppointmentDetails');
const diagnose = require('../controllers/prescribeMeds');
const path = require('path');
const viewHistory = require('../controllers/doctorViewHistory');
const viewBills = require('../controllers/doctorViewBills');
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



//view previous appointments medical history
router.get('/view-medical-history',viewHistory.getDoctorAppointmentsWithDiagnosis);


//view bills
router.get('/view-bills', (req, res) => {
    viewBills.doctorViewBills(req, res, (error, bills) => {
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('An error occurred');
        } else {
            // Render bills
            res.render('doctorViewBills', { bills });
        }
    });
});




module.exports = {router};