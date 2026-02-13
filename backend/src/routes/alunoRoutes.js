const express = require('express');
const router = express.Router();

const { createAluno, getAllAlunos, getAlunoById, deleteAluno, updateAluno, loginAluno, meAluno } = require('../controllers/alunoController');
const { requireAuth } = require("../middlewares/requireAuth");
const { requireRole} = require("../middlewares/requireRole");

// rotas auth
router.post("/login", loginAluno);
router.get("/me", requireAuth, meAluno);

// tudo admin-only
router.get("/", requireAuth, requireRole("admin"), getAllAlunos);
router.get("/:id", requireAuth, requireRole("admin"), getAlunoById);
router.post("/", requireAuth, requireRole("admin"), createAluno);
router.put("/:id", requireAuth, requireRole("admin"), updateAluno);
router.delete("/:id", requireAuth, requireRole("admin"), deleteAluno);


module.exports = router;