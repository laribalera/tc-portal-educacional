const { z } = require('zod');

const createProfessorSchema = z.object({
    nome: z.string().min(1, "o nome é obrigatório"),
    email: z.email("Email inválido"),
    disciplinas: z.array(z.string()).min(1, "pelo menos uma disciplina é obrigatória"),
    senha: z.string().min(6, "a senha deve ter no mínimo 6 caracteres")
});

const updateProfessorSchema = createProfessorSchema.partial();

module.exports = { createProfessorSchema, updateProfessorSchema };