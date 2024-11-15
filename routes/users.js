const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const conn = require('../connects/Sql');
const mongoose = require('../connects/Mongodb');

const connMongo = mongoose.connection;
connMongo.on('error', (err) => {});
connMongo.once('open', () => {});

// GET /users
router.get('/', async (req, res) => {
    try {
        const result = await conn.request().query('SELECT * FROM USERS');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving users: ", err);
        res.status(500).send("Error retrieving users.");
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await conn.request()
            .input('UserID', sql.NVarChar(20), id)
            .query('SELECT * FROM USERS WHERE UserID = @UserID');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error retrieving user: ", err);
        res.status(500).send("Error retrieving user.");
    }
});

// POST /users
router.post('/', async (req, res) => {
    const { UserID, Username, Password, Email, FullName, PhoneNumber, Ward, District, City, Role } = req.body;

    try {
        // SQL Insert
        await conn.request()
            .input('UserID', sql.NVarChar(20), UserID)
            .input('Username', sql.VarChar(50), Username)
            .input('Password', sql.VarChar(255), Password)
            .input('Email', sql.VarChar(100), Email)
            .input('FullName', sql.NVarChar(100), FullName)
            .input('PhoneNumber', sql.VarChar(15), PhoneNumber)
            .input('Ward', sql.NVarChar(100), Ward)
            .input('District', sql.NVarChar(100), District)
            .input('City', sql.NVarChar(100), City)
            .input('Role', sql.VarChar(20), Role || 'customer')
            .query(`INSERT INTO USERS (UserID, Username, Password, Email, FullName, PhoneNumber, Ward, District, City, Role)
                    VALUES (@UserID, @Username, @Password, @Email, @FullName, @PhoneNumber, @Ward, @District, @City, @Role)`);

        // MongoDB Insert
        const userDocument = {
            UserID,
            Username,
            Password,
            Email,
            FullName,
            PhoneNumber,
            Ward,
            District,
            City,
            Role: Role || 'customer'
        };

        await connMongo.collection('USERS').insertOne(userDocument);  // Save to MongoDB

        res.status(201).send("User added successfully to both SQL Server and MongoDB.");
    } catch (err) {
        console.error("Error adding user: ", err);
        res.status(500).send("Error adding user.");
    }
});

// PUT /users/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Username, Password, Email, FullName, PhoneNumber, Ward, District, City, Role } = req.body;

    try {
        // SQL Update
        await conn.request()
            .input('UserID', sql.NVarChar(20), id)
            .input('Username', sql.VarChar(50), Username)
            .input('Password', sql.VarChar(255), Password)
            .input('Email', sql.VarChar(100), Email)
            .input('FullName', sql.NVarChar(100), FullName)
            .input('PhoneNumber', sql.VarChar(15), PhoneNumber)
            .input('Ward', sql.NVarChar(100), Ward)
            .input('District', sql.NVarChar(100), District)
            .input('City', sql.NVarChar(100), City)
            .input('Role', sql.VarChar(20), Role)
            .query(`UPDATE USERS SET
                    Username = @Username, Password = @Password, Email = @Email,
                    FullName = @FullName, PhoneNumber = @PhoneNumber, Ward = @Ward,
                    District = @District, City = @City, Role = @Role
                    WHERE UserID = @UserID`);

        // MongoDB Update
        const userDocument = {
            UserID: id,
            Username,
            Password,
            Email,
            FullName,
            PhoneNumber,
            Ward,
            District,
            City,
            Role: Role || 'customer'
        };

        await connMongo.collection('USERS').updateOne({ UserID: id }, { $set: userDocument });
        res.status(200).send("User updated successfully.");
    } catch (err) {
        console.error("Error updating user: ", err);
        res.status(500).send("Error updating user.");
    }
});

// DELETE /users/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // SQL Delete
        await conn.request()
            .input('UserID', sql.NVarChar(20), id)
            .query('DELETE FROM USERS WHERE UserID = @UserID');

        // MongoDB Delete
        await connMongo.collection('USERS').deleteOne({ UserID: id });
        res.status(200).send("User deleted successfully.");
    } catch (err) {
        console.error("Error deleting user: ", err);
        res.status(500).send("Error deleting user.");
    }
});

module.exports = router;
