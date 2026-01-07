const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Post = require("../models/Post");

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
  // limpa a collection real que o populate usa
  await mongoose.connection.collection("professors").deleteMany({});
});

/**
 * cria professor SEM passar pelo schema real (que exige senha).
 * retorna { _id, name, email, disciplinas }.
 */
async function seedProfessor({
  name = "Prof",
  email = "prof@teste.com",
  disciplinas = [],
} = {}) {
  const doc = {
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    disciplinas,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await mongoose.connection.collection("professors").insertOne(doc);
  return doc;
}

function expectAutorPopulado(autor, prof) {
  expect(autor).toBeTruthy();
  expect(typeof autor).toBe("object");

  expect(String(autor._id)).toBe(String(prof._id));
  expect(autor.name).toBe(prof.name);
  expect(autor.email).toBe(prof.email);
  expect(Array.isArray(autor.disciplinas)).toBe(true);
}

describe("API /api/posts", () => {
  it("POST /api/posts - cria post com autor populado", async () => {
    const prof = await seedProfessor({
      name: "Diego",
      email: "diego@professor.com",
      disciplinas: ["Matemática"],
    });

    const payload = {
      titulo: "Primeiro post",
      conteudo: "Conteúdo de teste do post",
      materia: "teste",
      tags: ["tag1", "tag2"],
      autor: String(prof._id),
    };

    const res = await request(app).post("/api/posts").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe(payload.titulo);
    expectAutorPopulado(res.body.autor, prof);
  });

  it("POST /api/posts - retorna 400 se body inválido", async () => {
    const res = await request(app).post("/api/posts").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("GET /api/posts - lista posts ordenados desc com autor populado", async () => {
    const prof = await seedProfessor({
      name: "Dayana",
      email: "dayana@professor.com",
      disciplinas: ["Química"],
    });

    const older = await Post.create({
      titulo: "Post antigo",
      conteudo: "Conteúdo 1",
      materia: "teste",
      tags: ["a"],
      autor: prof._id,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });

    const newer = await Post.create({
      titulo: "Post recente",
      conteudo: "Conteúdo 2",
      materia: "teste",
      tags: ["b"],
      autor: prof._id,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
    });

    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]._id).toBe(String(newer._id));
    expect(res.body[1]._id).toBe(String(older._id));
    expectAutorPopulado(res.body[0].autor, prof);
  });

  it("GET /api/posts?authorId=ID - filtra por autor", async () => {
    const prof1 = await seedProfessor({
      name: "Ana",
      email: "ana@professor.com",
      disciplinas: ["Português"],
    });

    const prof2 = await seedProfessor({
      name: "Bruno",
      email: "bruno@professor.com",
      disciplinas: ["História"],
    });

    await Post.create({
      titulo: "Post Ana",
      conteudo: "conteúdo ok",
      materia: "teste",
      tags: [],
      autor: prof1._id,
    });

    await Post.create({
      titulo: "Post Bruno",
      conteudo: "conteúdo ok",
      materia: "teste",
      tags: [],
      autor: prof2._id,
    });

    const res = await request(app).get(`/api/posts?authorId=${prof1._id}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe("Post Ana");
    expectAutorPopulado(res.body[0].autor, prof1);
  });

  it("GET /api/posts?limit=2 - respeita limite", async () => {
    const prof = await seedProfessor({
      name: "Lia",
      email: "lia@professor.com",
      disciplinas: ["Artes"],
    });

    for (let i = 0; i < 5; i++) {
      await Post.create({
        titulo: `Post ${i}`,
        conteudo: "conteúdo ok",
        materia: "teste",
        tags: [],
        autor: prof._id,
      });
    }

    const res = await request(app).get("/api/posts?limit=2");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("GET /api/posts/:id - retorna post com autor populado", async () => {
    const prof = await seedProfessor({
      name: "Alessandra",
      email: "ale@professor.com",
      disciplinas: ["Artes"],
    });

    const post = await Post.create({
      titulo: "Post único",
      conteudo: "conteúdo ok",
      materia: "teste",
      tags: [],
      autor: prof._id,
    });

    const res = await request(app).get(`/api/posts/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("Post único");
    expectAutorPopulado(res.body.autor, prof);
  });

  it("GET /api/posts/:id - 404 se não existir", async () => {
    const res = await request(app).get(`/api/posts/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Post não encontrado");
  });

  it("PUT /api/posts/:id - atualiza post", async () => {
    const prof = await seedProfessor({
      name: "Marina",
      email: "marina@professor.com",
      disciplinas: ["Biologia"],
    });

    const post = await Post.create({
      titulo: "Antes",
      conteudo: "Antes (conteúdo ok)",
      materia: "teste",
      tags: ["a"],
      autor: prof._id,
    });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .send({
        titulo: "Depois",
        conteudo: "Depois (conteúdo ok)",
        materia: "teste",
        tags: ["b"],
      });

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("Depois");
    expectAutorPopulado(res.body.autor, prof);
  });

  it("PUT /api/posts/:id - 404 se post não existir (com payload válido)", async () => {
    const res = await request(app)
      .put(`/api/posts/${new mongoose.Types.ObjectId()}`)
      .send({
        titulo: "Título válido",
        conteudo: "Conteúdo válido para passar no schema",
        materia: "teste",
        tags: ["x"],
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("post nao encontrado");
  });

  it("DELETE /api/posts/:id - remove post", async () => {
    const prof = await seedProfessor({
      name: "Diego",
      email: "diego@professor.com",
      disciplinas: ["Matemática"],
    });

    const post = await Post.create({
      titulo: "Excluir",
      conteudo: "conteúdo ok",
      materia: "teste",
      tags: [],
      autor: prof._id,
    });

    const res = await request(app).delete(`/api/posts/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post deletado com sucesso");
    expect(res.body.post).toBeTruthy();
    expect(String(res.body.post._id)).toBe(String(post._id));

    const exists = await Post.findById(post._id);
    expect(exists).toBeNull();
  });

  it("GET /api/posts/search - 400 se q vazio", async () => {
    const res = await request(app).get("/api/posts/search?q=");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("parameter de busca q é obrigatório");
  });

  it("GET /api/posts/search", async () => {
    const prof = await seedProfessor({
      name: "Dayana",
      email: "dayana@professor.com",
      disciplinas: ["Química"],
    });

    await Post.create({
      titulo: "Aula de Química",
      conteudo: "Ligações químicas (conteúdo ok)",
      materia: "Ciências",
      tags: ["química"],
      autor: prof._id,
    });

    const res = await request(app).get("/api/posts/search?q=química");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe("Aula de Química");
    expectAutorPopulado(res.body[0].autor, prof);
  });
});
