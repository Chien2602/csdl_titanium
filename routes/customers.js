const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const conn = require('../connect');
const mongoose = require('../connectMongodb');

const connMongo = mongoose.connection;
connMongo.on('error', (err) => {});
connMongo.once('open', () => {});

router.get('/', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM CUSTOMER');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving customers: ", err);
        res.status(500).send("Error retrieving customers.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('CustomerID', sql.NVarChar(20), id)
            .query('SELECT * FROM CUSTOMER WHERE CustomerID = @CustomerID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving customer: ", err);
        res.status(500).send("Error retrieving customer.");
    }
});

router.post('/', async (req, res) => {
    const { CustomerID, LoyaltyPoints } = req.body;

    try {
        await conn.request()
            .input('CustomerID', sql.NVarChar(20), CustomerID)
            .input('LoyaltyPoints', sql.Int, LoyaltyPoints)
            .query(`INSERT INTO CUSTOMER (CustomerID, LoyaltyPoints)
                    VALUES (@CustomerID, @LoyaltyPoints)`);

        const adminDocument = {
            CustomerID,
            LoyaltyPoints
        };

        await connMongo.collection('CUSTOMER').insertOne(adminDocument);  // Save to MongoDB

        res.status(201).send("Customer added successfully to both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error adding Customer: ", err);
        res.status(500).send("Error adding Customer.");
    }
});

router.put('/:id', async (req, res) => {
    const { LoyaltyPoints } = req.body;
    const { id } = req.params;

    try {
        await conn.request()
            .input('CustomerID', sql.NVarChar(20), id)
            .input('LoyaltyPoints', sql.Date, LoyaltyPoints)
            .query(`UPDATE CUSTOMER SET LoyaltyPoints = @LoyaltyPoints WHERE CustomerID = @CustomerID`);

        const adminDocument = {
            $set: {
                LoyaltyPoints
            }
        };
        await connMongo.collection('CUSTOMER').updateOne({ CustomerID: id }, adminDocument);

        res.status(200).send("Customer updated successfully in both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error updating Customer: ", err);
        res.status(500).send("Error updating Customer.");
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await conn.request()
            .input('CustomerID', sql.NVarChar(20), id)
            .query('DELETE FROM CUSTOMER WHERE CustomerID = @CustomerID');

        await connMongo.collection('CUSTOMER').deleteOne({ CustomerID: id });
        res.status(200).send("Customer deleted successfully.");
    } catch (err) {
        console.error("Error deleting Customer: ", err);
        res.status(500).send("Error deleting Customer.");
    }
});

module.exports = router;
