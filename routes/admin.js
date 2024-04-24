const express= require('express');
const handleAdminReg = require('../controllers/newAdmin.js');
const seemeds = require('../controllers/fetchMeds.js');

const router= express.Router();



//to register new admin
router.post('/register',handleAdminReg.admin_register);



//to display available medicines
router.get('/search-medicine', (req, res) => {
    // Call the function to fetch available medicines
    seemeds.fetchAvailableMedicines((error, medicines) => {
        if (error) {
            // Handle error
            res.status(500).send('Error fetching available medicines');
        } else {
            // Render the target EJS file and pass the fetched data
            res.render('SeeAvailableMeds', { medicines: medicines });
        }
    });
});

router.get('/place-order', (req, res) => {
    // Call the function to fetch available medicines
    seemeds.fetchAvailableMedicines((error, medicines) => {
        if (error) {
            // Handle error
            res.status(500).send('Error fetching available medicines');
        } else {
            // Render the target EJS file and pass the fetched data
            res.render('place-order', { availableMeds: medicines });
        }
    });
});







module.exports={router};