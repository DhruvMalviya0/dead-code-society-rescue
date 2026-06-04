require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { NotFoundError } = require('./utils/errors.util');
const errorHandler = require('./middlewares/errorHandler.middleware');

// routes (index.js in src/routes)
const routes = require('./routes');

const app = express();
let queryCount = 0;

if (process.env.MONGOOSE_DEBUG === 'true') {
    mongoose.set('debug', function(collectionName, methodName) {
        queryCount += 1;
        console.log('[MONGO_DEBUG]', collectionName + '.' + methodName);
    });
}

// middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.MONGOOSE_DEBUG === 'true') {
    app.use((req, res, next) => {
        const startCount = queryCount;
        res.on('finish', () => {
            const requestQueries = queryCount - startCount;
            console.log('[QUERY_COUNT]', req.method, req.originalUrl, requestQueries);
        });
        next();
    });
}

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

app.use((req, res, next) => {
    next(new NotFoundError('Route not found'));
});

app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is alive on port ' + PORT);
    console.log('Wait for MongoDB before testing...');
});

// exporting for testing later
module.exports = app;
