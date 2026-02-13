const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Professor = require('../models/Professor');
const { createProfessorSchema, updateProfessorSchema } = require('../schemas/ProfessorSchema');

// implementando sha256 para senhas
function sha256(text) {
  return crypto.createHash("sha256").update(String(text)).digest("hex");
}

function signToken(professor) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET não configurado no .env");
  }

  return jwt.sign(
    {
      sub: professor._id.toString(),
      role: professor.role || "professor",
    },
    secret,
    { expiresIn }
  );
}


async function loginProfessor(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    // traz senha mesmo se estiver select:false no schema
    const professor = await Professor.findOne({ email }).select("+senha");
    if (!professor) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const senhaDigitada = String(password).trim();

    const ok = professor.senha === sha256(senhaDigitada);
    if (!ok) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = signToken(professor);

    return res.json({
      token,
      professor: {
        id: professor._id,
        name: professor.name,
        email: professor.email,
        disciplinas: professor.disciplinas,
        role: professor.role || "professor",
      },
    });
  } catch (err) {
    console.error("Erro no loginProfessor:", err);
    return res.status(500).json({ message: "Erro ao realizar login." });
  }
}

async function meProfessor(req, res) {
  try {
    const professorId = req.user.id;

    const professor = await Professor
      .findById(professorId)
      .select("-senha");

    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado." });
    }

    return res.json({
      id: professor._id,
      name: professor.name,
      email: professor.email,
      disciplinas: professor.disciplinas,
    });
  } catch (err) {
    console.error("Erro no meProfessor:", err);
    return res.status(500).json({ message: "Erro ao buscar professor logado." });
  }
}


// criar novo professor
const createProfessor = async (req, res) => {
  try {
    const data = createProfessorSchema.parse(req.body);

    // hash da senha antes de salvar
    data.senha = sha256(data.senha);

    const newProfessor = await Professor.create(data);

    // nao devolver a senha ao cadastras
    const obj = newProfessor.toObject();
    delete obj.senha;

    res.status(201).json(obj);
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
    console.log("UPDATE PARSED:", Object.keys(data), data.senha ? "(tem senha)" : "(sem senha)");

    if (data.senha) {
      data.senha = sha256(data.senha);
    }

    const professor = await Professor.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!professor) return res.status(404).json({ error: "Professor não encontrado" });

    const obj = professor.toObject();
    delete obj.senha;

    res.json(obj);
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
        { name: { $regex: q, $options: 'i' } }
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
    searchProfessorQuery,
    loginProfessor,
    meProfessor
};