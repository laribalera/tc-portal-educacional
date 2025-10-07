const Post = require('../models/Post');
const { createPostSchema } = require('../schemas/PostSchema');


// controller para criar post novo
const createPost = async (req, res) => {
  try {
    const data = createPostSchema.parse(req.body);
    const newPost = await Post.create(data);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};


/*
  colocar as funçoes embaixo de cada comentario de preferencia mantendo o padrao de nome funçãoPost (ex: getAllPost, getPostById, etc)
*/ 


//controller para pegar todos os posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Ordena por data de criação (mais recentes primeiro)
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};


// controller para pegar um post com id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
};



// controller para deletar um post com id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    res.json({ message: 'Post deletado com sucesso', post });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
};


// controller para dar update em um post
const updatePost = async (req, res) => {
  try {
    const data = createPostSchema.parse(req.body);
    const post = await Post.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!post) return res.status(404).json({ error: 'post nao encontrado' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// controller para fazer query search 





// adicionar o nome do controller aqui
module.exports = { createPost, updatePost, getAllPosts, getPostById, deletePost };
