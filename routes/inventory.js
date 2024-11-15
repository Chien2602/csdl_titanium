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
        const result = await conn.request().query('SELECT * FROM INVENTORY');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving inventory:", err);
        res.status(500).send("Error retrieving inventory.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('InventoryID', sql.NVarChar(20), id)
            .query('SELECT * FROM INVENTORY WHERE InventoryID = @InventoryID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving inventory:", err);
        res.status(500).send("Error retrieving inventory.");
    }
});

router.post('/', async (req, res) => {
    const { InventoryID, ProductID, Quantity, Supplier, Remarks } = req.body;
    const ReceivedDate = new Date();

    try {
        await conn.request()
            .input('InventoryID', sql.NVarChar(20), InventoryID)
            .input('ProductID', sql.NVarChar(20), ProductID)
            .input('Quantity', sql.Int, Quantity)
            .input('Supplier', sql.NVarChar(20), Supplier)
            .input('ReceivedDate', sql.DateTime, ReceivedDate)
            .input('Remarks', sql.NVarChar(200), Remarks)
            .query(`INSERT INTO INVENTORY (InventoryID, ProductID, Quantity, Supplier, ReceivedDate, Remarks)
                    VALUES (@InventoryID, @ProductID, @Quantity, @Supplier, @ReceivedDate, @Remarks)`);

        const inventoryDoc = { InventoryID, ProductID, Quantity, Supplier, ReceivedDate, Remarks };
        await connMongo.collection('INVENTORY').insertOne(inventoryDoc);

        res.status(201).send("Inventory record added successfully.");
    } catch (err) {
        console.error("Error adding inventory:", err);
        res.status(500).send("Error adding inventory.");
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Quantity, Supplier, Remarks } = req.body;

    try {
        await conn.request()
            .input('InventoryID', sql.NVarChar(20), id)
            .input('Quantity', sql.Int, Quantity)
            .input('Supplier', sql.NVarChar(20), Supplier)
            .input('Remarks', sql.NVarChar(200), Remarks)
            .query(`UPDATE INVENTORY SET 
                    Quantity = @Quantity, 
                    Supplier = @Supplier, 
                    Remarks = @Remarks 
                    WHERE InventoryID = @InventoryID`);

        await connMongo.collection('INVENTORY').updateOne(
            { InventoryID: id },
            { $set: { Quantity, Supplier, Remarks } }
        );

        res.status(200).send("Inventory record updated successfully.");
    } catch (err) {
        console.error("Error updating inventory:", err);
        res.status(500).send("Error updating inventory.");
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await conn.request()
            .input('InventoryID', sql.NVarChar(20), id)
            .query('DELETE FROM INVENTORY WHERE InventoryID = @InventoryID');

        await connMongo.collection('INVENTORY').deleteOne({ InventoryID: id });

        res.status(200).send("Inventory record deleted successfully.");
    } catch (err) {
        console.error("Error deleting inventory:", err);
        res.status(500).send("Error deleting inventory.");
    }
});

module.exports = router;
