require("dotenv").config();
const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");
const professorRoutes = require("./routes/professorRoutes");

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:8080"];

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/api/posts", postRoutes);
app.use("/api/professores", professorRoutes);

app.get("/", (req, res) => {
  res.send("Seja Bem-Vindo ao Portal Educacional");
});

module.exports = app;
