const express = require('express');
const handleEmployeeReg = require('../controllers/newEmployee');

const router = express.Router();


//registering new employee
router.post('/register',handleEmployeeReg.employee_register);

module.exports = {router};
