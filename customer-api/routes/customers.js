const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customers with pagination
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, customers: results });
  });
});

// GET specific customer with order count
router.get('/user_id', (req, res) => {
  const customerId = req.params.user_id;

  db.query('SELECT * FROM users WHERE user_id = ?', [customerId], (err, customers) => {
    if (err) return res.status(400).json({ success: false, message: 'Invalid ID' });
    if (customers.length === 0) return res.status(404).json({ success: false, message: 'Customer not found' });

    const customer = customers[0];
    db.query('SELECT COUNT(*) AS orderCount FROM orders WHERE user_id = ?', [customerId], (err, countResult) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      res.json({
        success: true,
        customer: {
          user_id: user_id,
          name: first_name,
          email: email,
          number_of_items: countResult[0].number_of_items
        }
      });
    });
  });
});

module.exports = router;