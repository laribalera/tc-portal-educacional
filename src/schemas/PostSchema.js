const { z } = require('zod');

const createPostSchema = z.object({
    titulo: z.string().min(3, "o título é obrigatório"),
    conteudo: z.string().min(10, "o conteúdo é obrigatório"),
     autor: z.object({
        name: z.string().min(1, "nome do professor é obrigatório"),
        email: z.email("Email inválido")
    })
});

module.exports = { createPostSchema };