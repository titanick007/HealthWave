const express = require('express');
const fetchDetails = require('./fetchDoctorsDetails');

const displayDetails = (req, res) => {
    fetchDetails.fetchAppointment(req, res) // Call the fetchAppointment function
        .then(appointments => {
            res.render('doctorViewApp', { appointments: appointments });
        })
        .catch(error => {
            console.error('Error fetching appointment details:', error);
            res.status(500).send('Error fetching appointment details');
        });
}

module.exports = { displayDetails };