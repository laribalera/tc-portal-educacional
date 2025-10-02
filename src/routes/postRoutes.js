const express = require('express');
const router = express.Router();

// importar o controller de get e delete aqui
const { createPost, updatePost } = require('../controllers/postController');

router.post('/', createPost);
router.put('/:id', updatePost);
//adicionar  uma linha para cada get e uma para delete aqui

module.exports = router;
