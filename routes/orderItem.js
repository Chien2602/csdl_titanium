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
        const result = await conn.request().query('SELECT * FROM ORDER_ITEM');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving Order Items:", err);
        res.status(500).send("Error retrieving Order Items.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('OrderItemID', sql.NVarChar(20), id)
            .query('SELECT * FROM ORDER_ITEM WHERE OrderItemID = @OrderItemID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving Order Item:", err);
        res.status(500).send("Error retrieving Order Item.");
    }
});

router.post('/', async (req, res) => {
    const { OrderItemID, OrderID, ProductID, Quantity, Price, Discount, Notes } = req.body;
    const AddedAt = new Date();
    const TotalPrice = (Price * Quantity) - (Discount || 0);

    try {
        await conn.request()
            .input('OrderItemID', sql.NVarChar(20), OrderItemID)
            .input('OrderID', sql.NVarChar(20), OrderID)
            .input('ProductID', sql.NVarChar(20), ProductID)
            .input('Quantity', sql.Int, Quantity)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('Discount', sql.Decimal(18, 2), Discount || 0)
            .input('TotalPrice', sql.Decimal(18, 2), TotalPrice)
            .input('AddedAt', sql.DateTime, AddedAt)
            .input('Notes', sql.NVarChar(200), Notes)
            .query(`INSERT INTO ORDER_ITEM 
                    (OrderItemID, OrderID, ProductID, Quantity, Price, Discount, TotalPrice, AddedAt, Notes)
                    VALUES (@OrderItemID, @OrderID, @ProductID, @Quantity, @Price, @Discount, @TotalPrice, @AddedAt, @Notes)`);

        const orderItemDoc = { OrderItemID, OrderID, ProductID, Quantity, Price, Discount, TotalPrice, AddedAt, Notes };
        await connMongo.collection('ORDER_ITEM').insertOne(orderItemDoc);

        res.status(201).send("Order Item added successfully.");
    } catch (err) {
        console.error("Error adding Order Item:", err);
        res.status(500).send("Error adding Order Item.");
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Quantity, Price, Discount, Notes } = req.body;
    const TotalPrice = (Price * Quantity) - (Discount || 0);

    try {
        await conn.request()
            .input('OrderItemID', sql.NVarChar(20), id)
            .input('Quantity', sql.Int, Quantity)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('Discount', sql.Decimal(18, 2), Discount || 0)
            .input('TotalPrice', sql.Decimal(18, 2), TotalPrice)
            .input('Notes', sql.NVarChar(200), Notes)
            .query(`UPDATE ORDER_ITEM SET 
                    Quantity = @Quantity, Price = @Price, Discount = @Discount, 
                    TotalPrice = @TotalPrice, Notes = @Notes 
                    WHERE OrderItemID = @OrderItemID`);

        await connMongo.collection('ORDER_ITEM').updateOne(
            { OrderItemID: id },
            { $set: { Quantity, Price, Discount, TotalPrice, Notes } }
        );

        res.status(200).send("Order Item updated successfully.");
    } catch (err) {
        console.error("Error updating Order Item:", err);
        res.status(500).send("Error updating Order Item.");
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await conn.request()
            .input('OrderItemID', sql.NVarChar(20), id)
            .query('DELETE FROM ORDER_ITEM WHERE OrderItemID = @OrderItemID');

        await connMongo.collection('ORDER_ITEM').deleteOne({ OrderItemID: id });

        res.status(200).send("Order Item deleted successfully.");
    } catch (err) {
        console.error("Error deleting Order Item:", err);
        res.status(500).send("Error deleting Order Item.");
    }
});

module.exports = router;
