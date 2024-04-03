const express= require('express');
const handleAdminReg = require('../controllers/newAdmin.js');

const router= express.Router();

router.post('/register',handleAdminReg.admin_register);
module.exports={router};