const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming the db.js file is one level up

// Your new API endpoints will go here
// Get all orders for a specific customer
router.get('/customers/:user_id', (req, res) => {
    const userId = req.params.user_id;
    
    // SQL query to join orders with customer data (optional) or just select orders by customer_id
    const sql = 'SELECT * FROM orders WHERE user_id = ?';
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        
        // Handle error case: Customer not found or no orders
        if (results.length === 0) {
            // Check if customer exists first to provide a more specific error
            // This requires an additional query, but is good practice.
            const checkCustomerSql = 'SELECT user_id FROM users WHERE user_id = ?';
            db.query(checkCustomerSql, [userIdId], (err, customerExists) => {
                if (customerExists.length === 0) {
                    return res.status(404).json({ success: false, message: 'Customer not found' });
                } else {
                    return res.status(404).json({ success: false, message: 'No orders found for this customer' });
                }
            });
        } else {
            // Return the orders
            res.status(200).json({ success: true, orders: results });
        }
    });
});
// Get specific order details
router.get('/:order_id', (req, res) => {
    const orderId = req.params.order_id;
    
    // SQL query to select a specific order
    const sql = 'SELECT * FROM orders WHERE order_id = ?';
    
    db.query(sql, [orderId], (err, results) => {
        if (err) {
            console.error('Error fetching order:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        
        // Handle error case: Order not found
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        // Return the specific order details
        res.status(200).json({ success: true, order: results[0] });
    });
});
module.exports = router;