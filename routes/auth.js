const express= require('express');
const handleLogin = require('../controllers/authController');

const router= express.Router();

router.post('/login',handleLogin.login);

module.exports={router};