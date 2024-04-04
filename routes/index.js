const express = require('express');
const path = require('path');
const authRoute = require('./auth');
const adminRoute = require('./admin');
const patientRoute = require('./patient');
const doctorRoute = require('./doctor');
const employeeRoute = require('./employee');
const fetchDoctorsDetails = require('../controllers/fetchDoctorsDetails');
const router=express.Router();
const publicDirectoryPath = path.join(__dirname, '..', 'public');

//Middleware
router.use(express.static(publicDirectoryPath));



//connecting to main login page
router.get('/',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/login.html');
});

//connecting to user registration page
router.get('/go_to_register',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/register.html');
})

//directing to registration pages
router.get('/new-patient-register',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/new-patient-register.html');
})
router.get('/new-doctor-register',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/new-doctor-register.html');
})
router.get('/new-admin-register',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/new-admin-register.html');
})
router.get('/new-employee-register',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/new-employee-register.html');
})

//Directing to dashboard pages

//Patient
router.get('/patient-dashboard',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/patient-dashboard.html');
})
//Doctor
router.get('/doctor-dashboard',(req,res)=>{
  res.sendFile(publicDirectoryPath+'/doctor-dashboard.html');
})


//login functionality
router.use('/auth',authRoute.router);

//returning available doctors for appointments
router.get('/schedule-appointment', async (req, res) => {
  try {
      // Fetch doctors from the database
      const doctors = await fetchDoctorsDetails.fetchDoctorsFromDatabase(); // Implement this function to fetch doctors

      // Render the appointment form and pass the list of doctors
      res.render('makeAppointment', { doctors });
  } catch (error) {
      // Handle errors
      console.error('Error fetching doctors:', error);
      res.status(500).send('Internal Server Error');
  }
});



//Admin route handling
router.use('/admin',adminRoute.router);

//Patient route handling
router.use('/patient',patientRoute.router);

//Doctor route handling
router.use('/doctor',doctorRoute.router);

//Employee route handling
router.use('/employee',employeeRoute.router);



module.exports={router};