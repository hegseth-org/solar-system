const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// ✅ Updated Mongoose connection (modern style)
mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD
})
.then(() => {
    console.log("MongoDB Connection Successful");
})
.catch(err => {
    console.log("MongoDB Connection Error:", err);
});

// Schema
const dataSchema = new mongoose.Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// 🔥 FIXED ROUTE (no callbacks anymore)
app.post('/planet', async (req, res) => {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });

        if (!planetData) {
            return res.status(404).send({
                message: "Planet not found (use id 0–9)"
            });
        }

        res.status(200).json(planetData);

    } catch (err) {
        res.status(500).send({
            error: "Error fetching planet data",
            details: err.message
        });
    }
});

// Routes
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
    fs.readFile('oas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.json(JSON.parse(data));
    });
});

app.get('/os', (req, res) => {
    res.json({
        os: OS.hostname(),
        env: process.env.NODE_ENV
    });
});

app.get('/live', (req, res) => {
    res.json({ status: "live" });
});

app.get('/ready', (req, res) => {
    res.json({ status: "ready" });
});

// Server start (kept for local run)
app.listen(3000, () => {
    console.log("Server successfully running on port - 3000");
});

module.exports = app;

// module.exports.handler = serverless(app);
