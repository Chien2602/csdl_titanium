const express = require('express');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/users');
const adminRoute = require('./routes/admins');
const employeeRoute = require('./routes/employees');
const customerRoute = require('./routes/customers');
const productRoute = require('./routes/product');
const product_infoRoute = require('./routes/productInfo');
const oderRoute = require('./routes/oder');
const oderItemRoute = require('./routes/oderItem');
const inventoryRoute = require('./routes/inventory');
const supplierRoute = require('./routes/supplier');

require('dotenv').config();
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/users', usersRoute);
app.use('/admins', adminRoute);
app.use('/customers', customerRoute);
app.use('/employees', employeeRoute);
app.use('/product', productRoute);
app.use('/productInfo', product_infoRoute);
app.use('/oder', oderRoute);
app.use('/oderItem', oderItemRoute);
app.use('/supplier', supplierRoute);
app.use('/inventory', inventoryRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
