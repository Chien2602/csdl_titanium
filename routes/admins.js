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
        const result = await conn.request().query('SELECT * FROM ADMIN');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving admins: ", err);
        res.status(500).send("Error retrieving admins.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('AdminID', sql.NVarChar(20), id)
            .query('SELECT * FROM ADMIN WHERE AdminID = @AdminID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving admin: ", err);
        res.status(500).send("Error retrieving admin.");
    }
});

router.post('/', async (req, res) => {
    const { AdminID, DayofBirth } = req.body;

    try {
        await conn.request()
            .input('AdminID', sql.NVarChar(20), AdminID)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(`INSERT INTO ADMIN (AdminID, DayofBirth)
                    VALUES (@AdminID, @DayofBirth)`);

        const adminDocument = {
            AdminID,
            DayofBirth
        };

        await connMongo.collection('ADMIN').insertOne(adminDocument);  // Save to MongoDB

        res.status(201).send("Admin added successfully to both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error adding admin: ", err);
        res.status(500).send("Error adding admin.");
    }
});

router.put('/:id', async (req, res) => {
    const { DayofBirth } = req.body;
    const { id } = req.params;

    try {
        await conn.request()
            .input('AdminID', sql.NVarChar(20), id)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(`UPDATE ADMIN SET DayofBirth = @DayofBirth WHERE AdminID = @AdminID`);

        const adminDocument = {
            $set: {
                DayofBirth
            }
        };
        await connMongo.collection('ADMIN').updateOne({ AdminID: id }, adminDocument);

        res.status(200).send("Admin updated successfully in both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error updating admin: ", err);
        res.status(500).send("Error updating admin.");
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await conn.request()
            .input('AdminID', sql.NVarChar(20), id)
            .query('DELETE FROM ADMIN WHERE AdminID = @AdminID');

        await connMongo.collection('ADMIN').deleteOne({ AdminID: id });
        res.status(200).send("Admin deleted successfully.");
    } catch (err) {
        console.error("Error deleting Admin: ", err);
        res.status(500).send("Error deleting Admin.");
    }
});

module.exports = router;
