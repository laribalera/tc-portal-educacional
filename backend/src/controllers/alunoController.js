const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Aluno = require('../models/Alunos');
const { createAlunoSchema, updateAlunoSchema } = require('../schemas/AlunoSchema');

// implementando sha256 para senhas
function sha256(text) {
  return crypto.createHash("sha256").update(String(text)).digest("hex");
}

function signToken(aluno) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!secret) {
    throw new Error("JWT_SECRET não configurado no .env");
    }

    return jwt.sign(
    { sub: aluno._id.toString(), role: "aluno" },
    secret,
    { expiresIn }
    );
}

async function loginAluno(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    // traz senha mesmo se estiver select:false no schema
    const aluno = await Aluno.findOne({ email }).select("+senha");
    if (!aluno) {
        return res.status(401).json({ message: "Credenciais inválidas." });
    }


    const senhaDigitada = String(password).trim();

    const ok = aluno.senha === sha256(senhaDigitada);
    if (!ok) {
        return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = signToken(aluno);

    return res.json({
        token,
        aluno: {
            id: aluno._id,
            name: aluno.name,
            email: aluno.email,
            disciplinas: aluno.disciplinas,
        },
    });
  } catch (err) {
    console.error("Erro no loginAluno:", err);
    return res.status(500).json({ message: "Erro ao realizar login." });
  }
}

async function meAluno(req, res) {
  try {
    const alunoId = req.userId;

    const aluno = await Aluno
        .findById(alunoId)
        .select("-senha");

    if (!aluno) {
        return res.status(404).json({ message: "Aluno não encontrado." });
    }

    return res.json({
        id: aluno._id,
        name: aluno.name,
        email: aluno.email,
        disciplinas: aluno.disciplinas,
        role: "aluno",
    });
  } catch (err) {
    console.error("Erro no meAluno:", err);
    return res.status(500).json({ message: "Erro ao buscar dados do aluno." });
    }
}


// controller para criar um aluno
async function createAluno(req, res) {
  try {
    const data = createAlunoSchema.parse(req.body);

    // hash da senha antes de salvar
    data.senha = sha256(data.senha);

    const newAluno = await Aluno.create(data);

    // não retorna a senha
    const { senha, ...alunoData } = newAluno.toObject();
    delete alunoData.senha;

    res.status(201).json(alunoData);
  } catch (error) {
    console.error("Erro no createAluno:", error);
    res.status(400).json({ error: error.errors || error.message });
  }
}

// controller para pegar todos os alunos
async function getAllAlunos(req, res) {
  try {
    const alunos = await Aluno.find().sort({ createdAt: -1 });
        res.json(alunos);
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar alunos' });
      }
    };

// controller para pegar um aluno por id
async function getAlunoById(req, res) {
    try {
         const aluno = await Aluno.findById(req.params.id).select("-senha");
            if (!aluno) {
              return res.status(404).json({ error: 'Aluno não encontrado' });
            }
            res.json(aluno);
            } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar aluno' });
            }
        };
    
// deletar aluno por id
async function deleteAluno(req, res) {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
}

// atualizar aluno por id
async function updateAluno(req, res) {
    try {
        const data = updateAlunoSchema.parse(req.body);
                
            if (data.senha) {
              data.senha = sha256(data.senha);
            }
        
            const aluno = await Aluno.findByIdAndUpdate(req.params.id, data, { new: true });
            if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
        
            const obj = aluno.toObject();
            delete obj.senha;
        
            res.json(obj);
          } catch (error) {
            res.status(400).json({ error: error.errors || error.message });
          }
        };


module.exports = {
    loginAluno,
    meAluno,
    createAluno,
    getAllAlunos,
    getAlunoById,
    deleteAluno,
    updateAluno
};