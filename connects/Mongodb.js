const mongoose = require('mongoose');
require('dotenv').config();
const dbURI = `mongodb://localhost:27017/${process.env.DB_DATABASE}`;

mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

module.exports = mongoose;