const connection = require('../database');

const doctorViewBills = (req, res, callback) => {
    // Retrieve the user_id from the session
    const userId = req.session.user_id;

    // Query to fetch the doctor's ID using the user_id
    const getDoctorIdQuery = 'SELECT doctor_id FROM Doctors WHERE user_id = ?';

    connection.query(getDoctorIdQuery, [userId], (error, doctorResults) => {
        if (error) {
            console.error('Error fetching doctor ID:', error);
            return callback(error, null); // Pass error to callback
        }

        // Check if any doctor was found
        if (doctorResults.length === 0) {
            return callback('Doctor not found', null); // Pass error to callback
        }

        const doctorId = doctorResults[0].doctor_id;

        // Query to fetch the bills associated with appointments made by the doctor
        const getBillsQuery = `
            SELECT B.appointment_id, B.billing_date, B.total_amt, 
                   M.name AS medicine_name, M.unit_price, AM.quantity
            FROM Billing B
            INNER JOIN Appointments A ON B.appointment_id = A.appointment_id
            INNER JOIN Appointment_Medicine AM ON A.appointment_id = AM.appointment_id
            INNER JOIN Pharmacy M ON AM.medicine_id = M.medicine_id
            WHERE A.doctor_id = ?
            GROUP BY B.appointment_id, B.billing_date, B.total_amt, 
                     M.name, M.unit_price, AM.quantity
        `;

        connection.query(getBillsQuery, [doctorId], (error, billResults) => {
            if (error) {
                console.error('Error fetching billing details:', error);
                return callback(error, null); // Pass error to callback
            }

            // Group the bill results by appointment_id
            const bills = billResults.reduce((acc, bill) => {
                const { appointment_id, billing_date, total_amt } = bill;
                if (!acc[appointment_id]) {
                    acc[appointment_id] = {
                        appointmentId: appointment_id,
                        billing_date: billing_date,
                        total_amount: total_amt,
                        medicines: []
                    };
                }
                acc[appointment_id].medicines.push({
                    medicine_name: bill.medicine_name,
                    unit_price: bill.unit_price,
                    quantity: bill.quantity
                });
                return acc;
            }, {});

            // Convert object back to array
            const billArray = Object.values(bills);

            // Pass bills to callback
            callback(null, billArray);
        });
    });
};

module.exports = { doctorViewBills };
