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
        const result = await conn.request().query('SELECT * FROM PRODUCT');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving products:", err);
        res.status(500).send("Error retrieving products.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('ProductID', sql.NVarChar(20), id)
            .query('SELECT * FROM PRODUCT WHERE ProductID = @ProductID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving product:", err);
        res.status(500).send("Error retrieving product.");
    }
});

router.post('/', async (req, res) => {
    const { ProductID, ProductName, Price, StockQuantity } = req.body;
    try {
        await conn.request()
            .input('ProductID', sql.NVarChar(20), ProductID)
            .input('ProductName', sql.NVarChar(100), ProductName)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('StockQuantity', sql.Int, StockQuantity)
            .query(`INSERT INTO PRODUCT (ProductID, ProductName, Price, StockQuantity)
                    VALUES (@ProductID, @ProductName, @Price, @StockQuantity)`);

        const productDoc = { ProductID, ProductName, Price, StockQuantity };
        await connMongo.collection('PRODUCT').insertOne(productDoc);

        res.status(201).send("Product added successfully.");
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).send("Error adding product.");
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { ProductName, Price, StockQuantity } = req.body;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar(20), id)
            .input('ProductName', sql.NVarChar(100), ProductName)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('StockQuantity', sql.Int, StockQuantity)
            .query(`UPDATE PRODUCT SET 
                    ProductName = @ProductName, 
                    Price = @Price, 
                    StockQuantity = @StockQuantity 
                    WHERE ProductID = @ProductID`);

        await connMongo.collection('PRODUCT').updateOne(
            { ProductID: id },
            { $set: { ProductName, Price, StockQuantity } }
        );

        res.status(200).send("Product updated successfully.");
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Error updating product.");
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar(20), id)
            .query('DELETE FROM PRODUCT WHERE ProductID = @ProductID');

        await connMongo.collection('PRODUCT').deleteOne({ ProductID: id });

        res.status(200).send("Product deleted successfully.");
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).send("Error deleting product.");
    }
});

module.exports = router;
