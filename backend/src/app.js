require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const professorRoutes = require('./routes/professorRoutes')

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json()); 
app.use("/api/posts", require("./routes/postRoutes"));
app.use('/api/professores', professorRoutes);


app.get('/', (req, res) => {
    res.send('Seja Bem-Vindo ao Portal Educacional');
    });

module.exports = app;
