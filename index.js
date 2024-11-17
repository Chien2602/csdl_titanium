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


app.use("/user", user);
app.use("/admin", admin);
app.use("/employee", employee);
app.use("/customer", customer)
app.use("/product", product);
app.use("/order", order);
app.use("/inventory", inventory);
app.use("/supplier", supplier);


app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});