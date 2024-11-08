const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const conn = require('../connect');
const mongoose = require('../connectMongodb');

const connMongo = mongoose.connection;
connMongo.on('error', (err));
connMongo.once('open');

router.get('/', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM PRODUCT_INFO');
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
            .query('SELECT * FROM PRODUCT_INFO WHERE ProductID = @ProductID');
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error("Error retrieving product:", err);
        res.status(500).send("Error retrieving product.");
    }
});

router.post('/', async (req, res) => {
    const { ProductID, Description, Size, Category, Image, Brand, SupplierID } = req.body;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar(20), ProductID)
            .input('Description', sql.NVarChar(200), Description)
            .input('Size', sql.NVarChar(20), Size)
            .input('Category', sql.NVarChar(50), Category)
            .input('Image', sql.NVarChar(300), Image)
            .input('Brand', sql.NVarChar(50), Brand)
            .input('SupplierID', sql.NVarChar(20), SupplierID)
            .query(`INSERT INTO PRODUCT_INFO (ProductID, Description, Size, Category, Image, Brand, SupplierID)
                    VALUES (@ProductID, @Description, @Size, @Category, @Image, @Brand, @SupplierID)`);

        const productDocument = {
            ProductID,
            Description,
            Size,
            Category,
            Image,
            Brand,
            SupplierID,
            AddedAt: new Date()
        };
        await connMongo.collection('PRODUCT_INFO').insertOne(productDocument);

        res.status(201).send("Product added successfully to both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).send("Error adding product.");
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Description, Size, Category, Image, Brand, SupplierID } = req.body;

    try {
        await conn.request()
            .input('ProductID', sql.NVarChar(20), id)
            .input('Description', sql.NVarChar(200), Description)
            .input('Size', sql.NVarChar(20), Size)
            .input('Category', sql.NVarChar(50), Category)
            .input('Image', sql.NVarChar(300), Image)
            .input('Brand', sql.NVarChar(50), Brand)
            .input('SupplierID', sql.NVarChar(20), SupplierID)
            .query(`UPDATE PRODUCT_INFO SET
                    Description = @Description, Size = @Size, Category = @Category,
                    Image = @Image, Brand = @Brand, SupplierID = @SupplierID
                    WHERE ProductID = @ProductID`);

        const productDocument = {
            Description,
            Size,
            Category,
            Image,
            Brand,
            SupplierID
        };
        await connMongo.collection('PRODUCT_INFO').updateOne(
            { ProductID: id },
            { $set: productDocument }
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
            .query('DELETE FROM PRODUCT_INFO WHERE ProductID = @ProductID');

        await connMongo.collection('PRODUCT_INFO').deleteOne({ ProductID: id });

        res.status(200).send("Product deleted successfully.");
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).send("Error deleting product.");
    }
});

module.exports = router;
