const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/CUAHANGQUANAO';

mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

module.exports = mongoose;
