const { z } = require('zod');

const postSchema = z.object({
    titulo: z.string().min(3, "o título é obrigatório"),
    conteudo: z.string().min(10, "o conteúdo é obrigatório"),
    professor: z.string().min(1, "o ID do professor é obrigatório")
});

module.exports = postSchema;