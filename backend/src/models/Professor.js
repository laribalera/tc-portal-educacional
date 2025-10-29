const mongoose = require('mongoose');

const ProfessorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  disciplinas: { type: [String], required: true },
  senha: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Professor', ProfessorSchema);
