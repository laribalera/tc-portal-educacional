const app = require('./app');

const connectToDB = require('./config/database');

const PORT = process.env.PORT || 3000;

connectToDB();

app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}`);
});

