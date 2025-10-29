const { z } = require('zod');

const createPostSchema = z.object({
    titulo: z.string().min(3, "o título é obrigatório"),
    conteudo: z.string().min(10, "o conteúdo é obrigatório"),
    materia: z.string().min(1, "a matéria é obrigatória"),
    tags: z.array(z.string()),
    autor: z.string().min(1, "autor é obrigatório")
});

//update para permitir atualizações parciais de campos
const updatePostSchema = createPostSchema.partial();

module.exports = { createPostSchema, updatePostSchema };