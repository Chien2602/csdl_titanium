const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
require('dotenv').config();
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Use the /users route
app.use('/users', usersRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
