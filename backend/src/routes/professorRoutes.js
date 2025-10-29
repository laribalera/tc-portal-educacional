const express = require('express');
const router = express.Router();

const { createProfessor, getAllProfessors, getProfessorById, deleteProfessor, updateProfessor, searchProfessorQuery } = require('../controllers/professorController');

router.get('/search', searchProfessorQuery);
router.get('/', getAllProfessors); 
router.get('/:id', getProfessorById);
router.post('/', createProfessor);   
router.put('/:id', updateProfessor);
router.delete('/:id', deleteProfessor);

module.exports = router;