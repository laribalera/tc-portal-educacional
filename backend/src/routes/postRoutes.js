const express = require('express');
const router = express.Router();

const { createPost, updatePost, getAllPosts, getPostById, deletePost, searchPostQuery } = require('../controllers/postController');

router.get('/search', searchPostQuery);
router.get('/', getAllPosts); 
router.get('/:id', getPostById);
router.post('/', createPost);   
router.put('/:id', updatePost);
router.delete('/:id', deletePost);


module.exports = router;
