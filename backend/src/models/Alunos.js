const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  disciplinas: { type: [String], required: true },
  senha: { type: String, required: true, select: false },
}, { timestamps: true });

module.exports = mongoose.model('Aluno', AlunoSchema);