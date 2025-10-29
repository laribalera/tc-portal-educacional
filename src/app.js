require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const professorRoutes = require('./routes/professorRoutes')

const app = express();

app.use(express.json()); 
app.use('/posts', postRoutes);
app.use('/professor', professorRoutes);

app.get('/', (req, res) => {
    res.send('Seja Bem-Vindo ao Portal Educacional');
    });

module.exports = app;
