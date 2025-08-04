const express = require('express');
const db = require('./db');
const cors = require('cors');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders'); // Add this line

const app = express();

app.use(cors());
app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});