const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const PostSchema = new mongoose.Schema({
    uuid: {type: String, required: true, default: uuidv4},
    titulo: {type: String, required: true},
    conteudo: {type: String, required: true},
    professor: {type: String, required: true},

}, {timestamps: true}); // vai ser usado em createAt e updateAt e preenchido automaticamente

module.exports = mongoose.model('Post', PostSchema);

