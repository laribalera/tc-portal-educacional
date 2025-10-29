const Professor = require('../models/Professor');
const { createProfessorSchema, updateProfessorSchema } = require('../schemas/ProfessorSchema');

// criar novo professor
const createProfessor = async (req, res) => {
  try {
    const data = createProfessorSchema.parse(req.body);
    const newProfessor = await Professor.create(data);
    res.status(201).json(newProfessor);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  } 
};

// pegar todos os professores
const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find().sort({ createdAt: -1 });
    res.json(professors);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar professores' });
  }
};

// pegar professor por id
const getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.json(professor);
    } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar professor' });
    }
};

// deletar professor por id
const deleteProfessor = async (req, res) => {
    try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.json({ message: 'Professor deletado com sucesso', professor });
    } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar professor' });
    }
};

// atualizar professor por id
const updateProfessor = async (req, res) => {
  try {
    const data = updateProfessorSchema.parse(req.body);
    const professor = await Professor.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.json(professor);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};


const searchProfessorQuery = async (req, res) => {
   try {
    const { q } = req.query;    
    if (!q) {
      return res.status(400).json({ error: 'parameter de busca q é obrigatório' });
    
    }
    
    const professor = await Professor.find({
      $or: [
        { nome: { $regex: q, $options: 'i' } }
      ],
    });

    res.json(professor);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'erro ao buscar professor', details: error.message });
  }
};

module.exports = {
    createProfessor,
    getAllProfessors,
    getProfessorById,
    deleteProfessor,
    updateProfessor,
    searchProfessorQuery
};