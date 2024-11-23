require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const { dbConnection } = require('./database/config');

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

// Server
app.listen(PORT, () => {
    console.log(`Server is running in port ${ PORT }`)
});