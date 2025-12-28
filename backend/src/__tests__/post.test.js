const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Post = require("../models/Post");

// Model mínimo de Professor só pros testes (sem depender do arquivo real)
const Professor =
  mongoose.models.Professor ||
  mongoose.model(
    "Professor",
    new mongoose.Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        disciplinas: [{ type: String }],
      },
      { timestamps: true, collection: "professors" }
    )
  );

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Post.deleteMany({});
  await Professor.deleteMany({});
});

// helper: aceita autor como objeto populado OU string id
function expectAutorOk(autor, expectedProfessorId, expectedName) {
  if (autor && typeof autor === "object") {
    // populate
    expect(String(autor._id || autor.id)).toBe(String(expectedProfessorId));
    expect(autor.name).toBe(expectedName);
  } else {
    // sem populate
    expect(String(autor)).toBe(String(expectedProfessorId));
  }
}

describe("Testes completos para a rota /posts", () => {
  // POST /posts
  it("deve criar um novo post com sucesso", async () => {
    const prof = await Professor.create({
      name: "Diego",
      email: "diego@professor.com",
      disciplinas: ["Matemática"],
    });

    const novoPost = {
      titulo: "primeiro post",
      conteudo: "Conteúdo de teste do post",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: String(prof._id),
    };

    const res = await request(app).post("/posts").send(novoPost);

    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe("primeiro post");

    // dependendo do seu controller (se você populou no create), pode vir string ou objeto
    expectAutorOk(res.body.autor, prof._id, "Diego");
  });

  // POST /posts - validação de erro por campos obrigatórios
  it("deve retornar erro 400 se faltar campos obrigatórios", async () => {
    const res = await request(app).post("/posts").send({});

    expect(res.status).toBe(400);

    // seu controller pode devolver:
    // { error: [...] } (zod errors) ou { error: "mensagem" }
    const err = res.body.error;
    expect(err).toBeTruthy();
  });

  // GET /posts
  it("deve listar todos os posts (com autor populado)", async () => {
    const prof = await Professor.create({
      name: "Dayana",
      email: "dany@professor.com",
      disciplinas: ["Química"],
    });

    await Post.create({
      titulo: "post 1",
      conteudo: "conteúdo 1",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: prof._id,
    });

    const res = await request(app).get("/posts");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe("post 1");

    // como seu GET /posts tem populate, aqui deve vir objeto
    expect(res.body[0].autor).toBeTruthy();
    expect(typeof res.body[0].autor).toBe("object");
    expect(String(res.body[0].autor._id || res.body[0].autor.id)).toBe(String(prof._id));
    expect(res.body[0].autor.name).toBe("Dayana");
  });

  // GET /posts/:id
  it("deve buscar um post por id (com autor populado)", async () => {
    const prof = await Professor.create({
      name: "Alessandra",
      email: "ale@professor.com",
      disciplinas: ["Artes"],
    });

    const post = await Post.create({
      titulo: "post teste",
      conteudo: "conteúdo teste",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: prof._id,
    });

    const res = await request(app).get(`/posts/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("post teste");

    // como seu GET /posts/:id agora tem populate, deve vir objeto
    expect(res.body.autor).toBeTruthy();
    expect(typeof res.body.autor).toBe("object");
    expect(String(res.body.autor._id || res.body.autor.id)).toBe(String(prof._id));
    expect(res.body.autor.name).toBe("Alessandra");
  });

  // GET /posts/:id - validação de erro para id inexistente
  it("deve retornar 404 se o id não existir", async () => {
    const res = await request(app).get(`/posts/${new mongoose.Types.ObjectId()}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Post não encontrado");
  });

  // DELETE /posts/:id
  it("deve excluir um post existente", async () => {
    const prof = await Professor.create({
      name: "Diego",
      email: "diego@professor.com",
      disciplinas: ["Matemática"],
    });

    const post = await Post.create({
      titulo: "post a excluir",
      conteudo: "conteúdo",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: prof._id,
    });

    const res = await request(app).delete(`/posts/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post deletado com sucesso");
  });

  // DELETE /posts/:id - validação de erro para id inexistente
  it("deve retornar 404 ao tentar excluir um post inexistente", async () => {
    const res = await request(app).delete(`/posts/${new mongoose.Types.ObjectId()}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Post não encontrado");
  });

  // GET /posts/search?q=termo
  it("deve retornar posts filtrados por termo de busca", async () => {
    const prof = await Professor.create({
      name: "Dayana",
      email: "dany@professor.com",
      disciplinas: ["Química"],
    });

    await Post.create({
      titulo: "teste busca",
      conteudo: "conteúdo teste",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: prof._id,
    });

    const res = await request(app).get("/posts/search?q=busca");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe("teste busca");

    // se você também colocou populate no search, vira objeto; se não, fica string
    // então deixei flexível:
    expectAutorOk(res.body[0].autor, prof._id, "Dayana");
  });
});
