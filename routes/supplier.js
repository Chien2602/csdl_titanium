const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const conn = require('../connects/Sql');
const mongoose = require('../connects/Mongodb');

const connMongo = mongoose.connection;
connMongo.on('error', (err) => {});
connMongo.once('open', () => {});

router.get('/', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM SUPPLIER');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving suppliers: ", err);
        res.status(500).send("Error retrieving suppliers.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('SupplierID', sql.NVarChar(20), id)
            .query('SELECT * FROM SUPPLIER WHERE SupplierID = @SupplierID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving supplier: ", err);
        res.status(500).send("Error retrieving supplier.");
    }
});

router.post('/', async (req, res) => {
    const { SupplierID, SupplierName, ContactName, ContactEmail, PhoneNumber, Address, City, District, Ward } = req.body;

    try {
        await conn.request()
            .input('SupplierID', sql.NVarChar(20), SupplierID)
            .input('SupplierName', sql.NVarChar(100), SupplierName)
            .input('ContactName', sql.NVarChar(100), ContactName)
            .input('ContactEmail', sql.VarChar(100), ContactEmail)
            .input('PhoneNumber', sql.VarChar(15), PhoneNumber)
            .input('Address', sql.NVarChar(255), Address)
            .input('City', sql.NVarChar(100), City)
            .input('District', sql.NVarChar(100), District)
            .input('Ward', sql.NVarChar(100), Ward)
            .query(`INSERT INTO SUPPLIER (SupplierID, SupplierName, ContactName, ContactEmail, PhoneNumber, Address, City, District, Ward)
                    VALUES (@SupplierID, @SupplierName, @ContactName, @ContactEmail, @PhoneNumber, @Address, @City, @District, @Ward)`);

        const supplierDocument = {
            SupplierID,
            SupplierName,
            ContactName,
            ContactEmail,
            PhoneNumber,
            Address,
            City,
            District,
            Ward
        };

        await connMongo.collection('SUPPLIER').insertOne(supplierDocument);
        res.status(201).send("Supplier added successfully to both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error adding supplier: ", err);
        res.status(500).send("Error adding supplier.");
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { SupplierName, ContactName, ContactEmail, PhoneNumber, Address, City, District, Ward } = req.body;

    try {
        await conn.request()
            .input('SupplierID', sql.NVarChar(20), id)
            .input('SupplierName', sql.NVarChar(100), SupplierName)
            .input('ContactName', sql.NVarChar(100), ContactName)
            .input('ContactEmail', sql.VarChar(100), ContactEmail)
            .input('PhoneNumber', sql.VarChar(15), PhoneNumber)
            .input('Address', sql.NVarChar(255), Address)
            .input('City', sql.NVarChar(100), City)
            .input('District', sql.NVarChar(100), District)
            .input('Ward', sql.NVarChar(100), Ward)
            .query(`UPDATE SUPPLIER SET
                    SupplierName = @SupplierName, ContactName = @ContactName, ContactEmail = @ContactEmail,
                    PhoneNumber = @PhoneNumber, Address = @Address, City = @City, District = @District,
                    Ward = @Ward
                    WHERE SupplierID = @SupplierID`);

        const supplierDocument = {
            SupplierID: id,
            SupplierName,
            ContactName,
            ContactEmail,
            PhoneNumber,
            Address,
            City,
            District,
            Ward
        };

        await connMongo.collection('SUPPLIER').updateOne({ SupplierID: id }, { $set: supplierDocument });
        res.status(200).send("Supplier updated successfully.");
    } catch (err) {
        console.error("Error updating supplier: ", err);
        res.status(500).send("Error updating supplier.");
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await conn.request()
            .input('SupplierID', sql.NVarChar(20), id)
            .query('DELETE FROM SUPPLIER WHERE SupplierID = @SupplierID');

        await connMongo.collection('SUPPLIER').deleteOne({ SupplierID: id });
        res.status(200).send("Supplier deleted successfully.");
    } catch (err) {
        console.error("Error deleting supplier: ", err);
        res.status(500).send("Error deleting supplier.");
    }
});

module.exports = router;
