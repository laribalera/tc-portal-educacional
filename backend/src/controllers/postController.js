const Post = require('../models/Post');
const { createPostSchema, updatePostSchema } = require('../schemas/PostSchema');


// controller para criar post novo
const createPost = async (req, res) => {
  try {
    const data = createPostSchema.parse(req.body);

    const newPost = await Post.create(data);
    const populated = await newPost.populate("autor", "name email disciplinas");

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};


//controller para pegar todos os posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("autor", "name email disciplinas") 
      .sort({ createdAt: -1 }); // mais recentes primeiro

    res.json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
}


// controller para pegar um post com id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("autor", "name email disciplinas");
    
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
    const data = updatePostSchema.parse(req.body);

    const post = await Post.findByIdAndUpdate(req.params.id, data, { new: true })
      .populate("autor", "name email disciplinas");

    if (!post) return res.status(404).json({ error: 'post nao encontrado' });

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// controller para fazer query search 
const searchPostQuery = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'parameter de busca q é obrigatório' });

    const posts = await Post.find({
      $or: [
        { titulo: { $regex: q, $options: 'i' } },
        { conteudo: { $regex: q, $options: 'i' } },
        { materia: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    })
      .populate("autor", "name email disciplinas")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'erro ao buscar posts', details: error.message });
  }
};





// adicionar o nome do controller aqui
module.exports = { createPost, updatePost, getAllPosts, getPostById, deletePost, searchPostQuery };
