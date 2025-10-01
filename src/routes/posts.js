const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// POST /posts - criar um novo post
router.post('/', async (req, res) => {
    try {

        const { titulo, conteudo, professor } = req.body;
        const newPost = new Post({ titulo, conteudo, professor });
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {

        res.status(400).json({error: error.errors ? error.errors : error.message});

    }
});

// PUT posts/:id - atualizar um post existente




// GET /search - procura com query - TESTAR 
//router.get('/search', async (req, res) => {
//    const {query} = req.query;
//    const posts = await Post.find({
//        $or: [
//            {titulo: {$regex: query, $options: 'i'}},
//            {conteudo: {$regex: query, $options: 'i'}}
//        ],
//    })
//    res.json(posts);
//});

