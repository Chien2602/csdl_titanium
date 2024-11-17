const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const adminRoute = require('./routes/admins');
const employeeRoute = require('./routes/employees');
const customerRoute = require('./routes/customers');
const productRoute = require('./routes/product');
const product_infoRoute = require('./routes/productInfo');
const oderRoute = require('./routes/order');
const oderItemRoute = require('./routes/orderItem');
const inventoryRoute = require('./routes/inventory');
const supplierRoute = require('./routes/supplier');

require('dotenv').config();
const app = express();
const port = 3000;


// Nếu chỉ muốn cho phép một nguồn cụ thể, ví dụ từ localhost:63342
// app.use(cors({ origin: 'http://localhost:63342' }));

app.use(bodyParser.json());

app.use('/user', usersRoute);
app.use('/admin', adminRoute);
app.use('/customer', customerRoute);
app.use('/employee', employeeRoute);
app.use('/product', productRoute);
app.use('/productInfo', product_infoRoute);
app.use('/order', oderRoute);
app.use('/orderItem', oderItemRoute);
app.use('/supplier', supplierRoute);
app.use('/inventory', inventoryRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
