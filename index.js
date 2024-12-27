const express = require("express")
const app = express();
const port = 3000;

const user = require("./pages/user");
const admin = require("./pages/admin");
const employee = require("./pages/employee");
const customer = require("./pages/customer");
const order = require("./pages/order");
const product = require("./pages/product");
const inventory = require("./pages/inventory");
const supplier = require("./pages/supplier");
const addUser = require("./pages/addUser");
const addAdmin = require("./pages/addAdmin");
const addCustomer = require("./pages/addCustomer");
const addProduct = require("./pages/addProduct");
const addEmployee = require("./pages/addEmployee");
const addSupplier = require("./pages/addSupplier");
const addOrder = require("./pages/addOrder");
const addInventory = require("./pages/addInventory");

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

app.use(bodyParser.json());

// API
app.use('/usersRoute', usersRoute);
app.use('/adminRoute', adminRoute);
app.use('/customerRoute', customerRoute);
app.use('/employeeRoute', employeeRoute);
app.use('/productRoute', productRoute);
app.use('/product_infoRoute', product_infoRoute);
app.use('/orderRoute', oderRoute);
app.use('/orderItemRoute', oderItemRoute);
app.use('/supplierRoute', supplierRoute);
app.use('/inventoryRoute', inventoryRoute);

//*****//
app.use("/user", user);
app.use("/admin", admin);
app.use("/employee", employee);
app.use("/customer", customer)
app.use("/product", product);
app.use("/order", order);
app.use("/inventory", inventory);
app.use("/supplier", supplier);


app.use("/addUser", addUser);
app.use("/addAdmin", addAdmin);
app.use("/addEmployee", addEmployee);
app.use("/addCustomer", addCustomer)
app.use("/addProduct", addProduct);
app.use("/addOrder", addOrder);
app.use("/addInventory", addInventory);
app.use("/addSupplier", addSupplier);

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});