const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const adminRoute = require('./routes/admins');
const employeeRoute = require('./routes/employees');
const customerRoute = require('./routes/customers');
require('dotenv').config();
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/users', usersRoute);
app.use('/admins', adminRoute);
app.use('/customers', customerRoute);
app.use('/employees', employeeRoute)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
