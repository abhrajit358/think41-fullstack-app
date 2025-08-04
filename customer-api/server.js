const express = require('express');
const db=require('./db');
const cors = require('cors');
const customerRoutes = require('./routes/customers');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/customers', customerRoutes);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});