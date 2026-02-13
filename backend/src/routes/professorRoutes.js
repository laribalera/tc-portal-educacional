const express = require('express');
const router = express.Router();

const { createProfessor, getAllProfessors, getProfessorById, deleteProfessor, updateProfessor, searchProfessorQuery, loginProfessor, meProfessor } = require('../controllers/professorController');
const { requireAuth } = require("../middlewares/requireAuth");
const { requireRole } = require("../middlewares/requireRole");

// rotas auth
router.post("/login", loginProfessor);
router.get("/me", requireAuth, meProfessor);

// rotas crud protegidas com role admin
router.get("/", requireAuth, requireRole("admin"), getAllProfessors);
router.get("/search", requireAuth, requireRole("admin"), searchProfessorQuery);
router.post("/", requireAuth, requireRole("admin"), createProfessor);
router.put("/:id", requireAuth, requireRole("admin"), updateProfessor);
router.delete("/:id", requireAuth, requireRole("admin"), deleteProfessor);



module.exports = router;