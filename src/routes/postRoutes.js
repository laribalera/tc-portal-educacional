const express = require('express');
const router = express.Router();

const { createPost, updatePost, getAllPosts, getPostById, deletePost, searchPostQuery } = require('../controllers/postController');

router.get('/search', searchPostQuery);
router.post('/', createPost);
router.get('/', getAllPosts);    
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
