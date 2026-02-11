const express = require('express');
const router = express.Router();

const { createAluno, getAllAlunos, getAlunoById, deleteAluno, updateAluno, loginAluno, meAluno } = require('../controllers/alunoController');
const { requireAuth } = require("../middlewares/requireAuth");

// rotas auth
router.post("/login", loginAluno);
router.get("/me", requireAuth, meAluno);

// rotas crud
router.get('/', getAllAlunos);
router.get('/:id', getAlunoById);
router.post('/', createAluno);
router.put('/:id', updateAluno);
router.delete('/:id', deleteAluno);


module.exports = router;