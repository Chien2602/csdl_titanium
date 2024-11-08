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
        const result = await conn.request().query('SELECT * FROM EMPLOYEE');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving employee: ", err);
        res.status(500).send("Error retrieving employee.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('EmployeeID', sql.NVarChar(20), id)
            .query('SELECT * FROM EMPLOYEE WHERE EmployeeID = @EmployeeID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving employee: ", err);
        res.status(500).send("Error retrieving employee.");
    }
});

router.post('/', async (req, res) => {
    const { EmployeeID, Salary, DayofBirth } = req.body;

    try {
        await conn.request()
            .input('EmployeeID', sql.NVarChar(20), EmployeeID)
            .input('Salary', sql.Decimal(18, 2), Salary)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(`INSERT INTO ADMIN (EmployeeID, Salary, DayofBirth)
                    VALUES (@EmployeeID, @Salary, @DayofBirth)`);

        const adminDocument = {
            EmployeeID,
            Salary,
            DayofBirth
        };

        await connMongo.collection('EMPLOYEE').insertOne(adminDocument);  // Save to MongoDB

        res.status(201).send("Employee added successfully to both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error adding Employee: ", err);
        res.status(500).send("Error adding Employee.");
    }
});

router.put('/:id', async (req, res) => {
    const { DayofBirth, Salary } = req.body;
    const { id } = req.params;

    try {
        await conn.request()
            .input('EmployeeID', sql.NVarChar(20), id)
            .input('Salary', sql.Decimal(18, 2), Salary)
            .input('DayofBirth', sql.Date, DayofBirth)
            .query(`UPDATE EMPLOYEE SET Salary = @Salary, DayofBirth = @DayofBirth WHERE EmployeeID = @EmployeeID`);

        await connMongo.collection('EMPLOYEE').updateOne(
            { EmployeeID: id },
            { $set: { Salary, DayofBirth } }
        );

        res.status(200).send("Employee updated successfully in both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error updating Employee: ", err);
        res.status(500).send("Error updating Employee.");
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await conn.request()
            .input('EmployeeID', sql.NVarChar(20), id)
            .query('DELETE FROM EMPLOYEE WHERE EmployeeID = @EmployeeID');

        await connMongo.collection('EMPLOYEE').deleteOne({ EmployeeID: id });
        res.status(200).send("Employee deleted successfully.");
    } catch (err) {
        console.error("Error deleting Employee: ", err);
        res.status(500).send("Error deleting Employee.");
    }
});

module.exports = router;

