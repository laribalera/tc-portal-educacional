const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    conteudo: {type: String, required: true},
    autor: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  }

}, {timestamps: true}); // vai ser usado em createAt e updateAt e preenchido automaticamente

module.exports = mongoose.model('Post', PostSchema);

