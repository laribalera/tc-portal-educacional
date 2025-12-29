const express = require('express');
const router = express.Router();

const { createProfessor, getAllProfessors, getProfessorById, deleteProfessor, updateProfessor, searchProfessorQuery, loginProfessor, meProfessor } = require('../controllers/professorController');
const { requireAuth } = require("../middlewares/requireAuth");

// rotas auth
router.post("/login", loginProfessor);
router.get("/me", requireAuth, meProfessor);

// rotas crud
router.get('/search', searchProfessorQuery);
router.get('/', getAllProfessors); 
router.get('/:id', getProfessorById);
router.post('/', createProfessor);   
router.put('/:id', updateProfessor);
router.delete('/:id', deleteProfessor);



module.exports = router;