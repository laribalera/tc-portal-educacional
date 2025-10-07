const express = require('express');
const router = express.Router();

const { createPost, updatePost, getAllPosts, getPostById, deletePost } = require('../controllers/postController');

router.post('/', createPost);
router.get('/', getAllPosts);    
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
