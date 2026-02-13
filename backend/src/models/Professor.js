const mongoose = require('mongoose');

const ProfessorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  disciplinas: { type: [String], required: true },
  senha: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "professor"], default: "professor" }
}, { timestamps: true });

module.exports = mongoose.model('Professor', ProfessorSchema);
