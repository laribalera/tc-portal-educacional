const express = require('express');
const app = express();
const postRoute = require('./routes/postRoute');

app.use(express.json());
app.use('/posts', postRoute);

app.get('/', (req, res) => {
    res.send('Portal Educacional');
    });


module.exports = app;