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
        const result = await conn.request().query('SELECT * FROM [ORDER]');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving orders:", err);
        res.status(500).send("Error retrieving orders.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('OrderID', sql.NVarChar(20), id)
            .query('SELECT * FROM [ORDER] WHERE OrderID = @OrderID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving order:", err);
        res.status(500).send("Error retrieving order.");
    }
});

router.post('/', async (req, res) => {
    const { OrderID, CustomerID, TotalAmount, Status } = req.body;
    const OrderDate = new Date();

    try {
        await conn.request()
            .input('OrderID', sql.NVarChar(20), OrderID)
            .input('CustomerID', sql.NVarChar(20), CustomerID)
            .input('OrderDate', sql.DateTime, OrderDate)
            .input('TotalAmount', sql.Decimal(18, 2), TotalAmount)
            .input('Status', sql.NVarChar(20), Status)
            .query(`INSERT INTO [ORDER] (OrderID, CustomerID, OrderDate, TotalAmount, Status)
                    VALUES (@OrderID, @CustomerID, @OrderDate, @TotalAmount, @Status)`);

        const orderDoc = { OrderID, CustomerID, OrderDate, TotalAmount, Status };
        await connMongo.collection('ORDER').insertOne(orderDoc);

        res.status(201).send("Order added successfully.");
    } catch (err) {
        console.error("Error adding order:", err);
        res.status(500).send("Error adding order.");
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TotalAmount, Status } = req.body;

    try {
        await conn.request()
            .input('OrderID', sql.NVarChar(20), id)
            .input('TotalAmount', sql.Decimal(18, 2), TotalAmount)
            .input('Status', sql.NVarChar(20), Status)
            .query(`UPDATE [ORDER] SET 
                    TotalAmount = @TotalAmount, 
                    Status = @Status 
                    WHERE OrderID = @OrderID`);

        await connMongo.collection('ORDER').updateOne(
            { OrderID: id },
            { $set: { TotalAmount, Status } }
        );

        res.status(200).send("Order updated successfully.");
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).send("Error updating order.");
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await conn.request()
            .input('OrderID', sql.NVarChar(20), id)
            .query('DELETE FROM [ORDER] WHERE OrderID = @OrderID');

        await connMongo.collection('ORDER').deleteOne({ OrderID: id });

        res.status(200).send("Order deleted successfully.");
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).send("Error deleting order.");
    }
});

module.exports = router;
