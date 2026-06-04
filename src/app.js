require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// routes (index.js in src/routes)
const routes = require('./routes');

const app = express();

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack';

async function initDB() {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('--- DATABASE CONNECTED ---');
    } catch (err) {
        console.log('DATABASE CONNECTION ERROR:');
        console.log(err);
    }
}

initDB();

// register routes
app.use('/api', routes); // all routes under /api

// welcome route
app.get('/', function(req, res) {
    res.json({ message: 'LogiTrack Backend running' });
});

// no 404 handler here, let express handle it for now

// start server
const PORT = process.env.PORT || 3000;
// SMELL: [MEDIUM] Server starts regardless of DB connection; consider delaying `app.listen` until DB is connected to avoid runtime errors.
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
