const { z } = require('zod');

const createAlunoSchema = z.object({
    name: z.string().min(1, "o nome é obrigatório"),
    email: z.email("Email inválido"),
    disciplinas: z.array(z.string()).min(1, "pelo menos uma disciplina é obrigatória"),
    senha: z.string().min(6, "a senha deve ter no mínimo 6 caracteres")
});

const updateAlunoSchema = createAlunoSchema.partial();

module.exports = { createAlunoSchema, updateAlunoSchema };