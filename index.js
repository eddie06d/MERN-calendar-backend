require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const eventsRoutes = require('./src/routes/events');
const { dbConnection } = require('./src/database/config');

const PORT = process.env.PORT || 4000;

// Application
const app = express();

// DB connection
dbConnection();

// Public Directory
app.use(express.static('public'));

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Server
app.listen(PORT, () => {
    console.log(`Server is running in port ${ PORT }`)
});