const Post = require('../models/Post');
const { createPostSchema, updatePostSchema } = require('../schemas/PostSchema');

const AUTHOR_SELECT = "name email disciplinas"; // mantém padrão

// controller para criar post novo
const createPost = async (req, res) => {
  try {
    const data = createPostSchema.parse(req.body);

    const newPost = await Post.create(data);
    const populated = await Post.findById(newPost._id).populate("autor", AUTHOR_SELECT);

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

//controller para pegar todos os posts (ajustado para filtro por autor e limite)
const getAllPosts = async (req, res) => {
  try {
    const { authorId, limit } = req.query;

    const query = {};
    if (authorId) query.autor = authorId;

    const lim = limit ? Math.min(parseInt(limit, 10) || 0, 100) : 0;

    let q = Post.find(query)
      .populate("autor", AUTHOR_SELECT)
      .sort({ createdAt: -1 });

    if (lim > 0) q = q.limit(lim);

    const posts = await q;

    res.json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
};

// controller para pegar um post com id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("autor", AUTHOR_SELECT);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(post);
  } catch (error) {
    console.error("Erro ao buscar post:", error);
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
    console.error("Erro ao deletar post:", error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
};

// controller para dar update em um post
const updatePost = async (req, res) => {
  try {
    const data = updatePostSchema.parse(req.body);

    const post = await Post.findByIdAndUpdate(req.params.id, data, { new: true })
      .populate("autor", AUTHOR_SELECT);

    if (!post) return res.status(404).json({ error: 'post nao encontrado' });

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// controller para fazer query search
const searchPostQuery = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(400).json({ error: 'parameter de busca q é obrigatório' });

    const posts = await Post.find({
      $or: [
        { titulo: { $regex: q, $options: 'i' } },
        { conteudo: { $regex: q, $options: 'i' } },
        { materia: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    })
      .collation({ locale: "pt", strength: 1 })
      .populate("autor", AUTHOR_SELECT)
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'erro ao buscar posts', details: error.message });
  }
};

// adicionar o nome do controller aqui
module.exports = { createPost, updatePost, getAllPosts, getPostById, deletePost, searchPostQuery };
