const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Post = require("../models/Post");

let mongoServer;

// vamos usar um banco em memória para os testes

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
});

describe("Testes completos para a rota /posts", () => {

  // POST /posts
  it("deve criar um novo post com sucesso", async () => {
    const novoPost = {
      titulo: "primeiro post",
      conteudo: "Conteúdo de teste do post",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: "69015af8c0bcdf76266a1eec",
    };

    const res = await request(app).post("/posts").send(novoPost);

    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe("primeiro post");
    expect(res.body.autor).toBe("69015af8c0bcdf76266a1eec");
  });

  // POST /posts - validação de erro por campos obrigatórios
  it("deve retornar erro 400 se faltar campos obrigatórios", async () => {
    const res = await request(app).post("/posts").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/autor|titulo|conteudo/);
  });

  // GET /posts
  it("deve listar todos os posts", async () => {
    await Post.create({
      titulo: "post 1",
      conteudo: "conteúdo 1",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: "69015af8c0bcdf76266a1eec"
    });

    const res = await request(app).get("/posts");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe("post 1");
  });

  // GET /posts/:id
  it("deve buscar um post por id", async () => {
    const post = await Post.create({
      titulo: "post teste",
      conteudo: "conteúdo teste",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: "69015af8c0bcdf76266a1eec"
    });

    const res = await request(app).get(`/posts/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("post teste");
  });


  // GET /posts/:id - validação de erro para id inexistente
  it("deve retornar 404 se o id não existir", async () => {
    const res = await request(app).get(`/posts/${new mongoose.Types.ObjectId()}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Post não encontrado");
  });


  // DELETE /posts/:id
  it("deve excluir um post existente", async () => {
    const post = await Post.create({
      titulo: "post a excluir",
      conteudo: "conteúdo",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: "69015af8c0bcdf76266a1eec"
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
    await Post.create({
      titulo: "teste busca",
      conteudo: "conteúdo teste",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: "69015af8c0bcdf76266a1eec"
    });

    const res = await request(app).get("/posts/search?q=busca");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe("teste busca");
  });

});
