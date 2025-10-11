# Portal Educacional API

API RESTful para gerenciamento de conteúdo educacional através de posts. Desenvolvida com Node.js, Express, MongoDB e validação com Zod.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a aplicação](#executando-a-aplicação)
- [Referência da API](#referência-da-api)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Docker](#docker)
- [Desenvolvimento](#desenvolvimento)
- [Integrantes do grupo](#integrantes-do-grupo)
- [Relato de experiências](#relato-de-experiências)

## Visão geral

O Portal Educacional é uma API RESTful projetada para gerenciar conteúdo educacional através de um sistema baseado em posts. A aplicação oferece operações CRUD completas para posts educacionais com validação robusta de dados e capacidades de busca.

### Principais funcionalidades

- Operações CRUD completas para posts educacionais
- Validação de dados usando schemas Zod
- Consulta textual completa em títulos e conteúdo
- Testes automatizados com Jest
- Suporte à containerização com Docker
- Padrão de arquitetura MVC
- Timestamps automáticos (createdAt, updatedAt)

## Arquitetura

A aplicação segue o padrão Model-View-Controller (MVC) com separação clara de responsabilidades:

```
src/
├── config/          # Arquivos de configuração
├── controllers/     # Lógica de negócio
├── models/         # Modelos de dados (Mongoose)
├── routes/         # Definições de rotas
├── schemas/        # Validação de dados (Zod)
├── __tests__/      # Testes automatizados
├── app.js          # Configuração do Express
└── server.js       # Arquivo principal do servidor
```

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- MongoDB 
- Docker

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd tc-portal-educacional
```

2. Instale as dependências:
```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
MONGO_URI=mongodb://localhost:27017/portal_educacional
PORT=3000
```

## Executando a aplicação

### Modo de desenvolvimento
```bash
npm run dev
```

### Modo de produção
```bash
npm start
```

### Executando testes
```bash
npm test
```

O servidor estará disponível em `http://localhost:3000`.

## Referência da API

### URL base
```
http://localhost:3000
```

### Endpoints

#### Verificação de Saúde
```http
GET /
```
Retorna uma mensagem de boas-vindas.

**Resposta:**
```
"Seja Bem-Vindo ao Portal Educacional"
```

#### Posts

##### Criar post
```http
POST /posts
Content-Type: application/json
```

**Corpo da requisição:**
```json
{
  "titulo": "string (mínimo 3 caracteres)",
  "conteudo": "string (mínimo 10 caracteres)",
  "autor": {
    "name": "string (obrigatório)",
    "email": "string (formato de email válido)"
  }
}
```

**Resposta de exempplo (201):**
```json
{
  "_id": "string",
  "titulo": "string",
  "conteudo": "string",
  "autor": {
    "name": "string",
    "email": "string"
  },
  "createdAt": "timestamp ISO 8601",
  "updatedAt": "timestamp ISO 8601"
}
```

**Resposta de erro (400):**
```json
{
  "error": "Detalhes do erro de validação"
}
```

##### Obter todos os posts
```http
GET /posts
```

**Resposta de exemplo (200):**
```json
[
  {
    "_id": "string",
    "titulo": "string",
    "conteudo": "string",
    "autor": {
      "name": "string",
      "email": "string"
    },
    "createdAt": "timestamp ISO 8601",
    "updatedAt": "timestamp ISO 8601"
  }
]
```

##### Consultar post por ID
```http
GET /posts/:id
```

**Parâmetros:**
- `id` (string, obrigatório): ObjectId do MongoDB

**Resposta de exemplo (200):**
```json
{
  "_id": "string",
  "titulo": "string",
  "conteudo": "string",
  "autor": {
    "name": "string",
    "email": "string"
  },
  "createdAt": "timestamp ISO 8601",
  "updatedAt": "timestamp ISO 8601"
}
```

**Resposta de erro (404):**
```json
{
  "error": "Post não encontrado"
}
```

##### Atualizar post
```http
PUT /posts/:id
Content-Type: application/json
```

**Parâmetros:**
- `id` (string, obrigatório): ObjectId do MongoDB

**Corpo da requisição:** Mesmo formato do Criar post

**Resposta (200):** Mesmo formato do Obter post por ID

**Respostas de erro:**
- `400`: Erro de validação
- `404`: Post não encontrado

##### Deletar post
```http
DELETE /posts/:id
```

**Parâmetros:**
- `id` (string, obrigatório): ObjectId do MongoDB

**Resposta (200):**
```json
{
  "message": "Post deletado com sucesso"
}
```

**Resposta de erro (404):**
```json
{
  "error": "Post não encontrado"
}
```

##### Consultar posts por termo
```http
GET /posts/search?q={consulta}
```

**Parâmetros de query:**
- `q` (string, obrigatório): Termo de consulta

**Resposta (200):** Array de posts que correspondem aos critérios de consulta

**Resposta de erro (400):**
```json
{
  "error": "parameter de consulta q é obrigatório"
}
```

### Códigos de status HTTP

| Código | Descrição |
|--------|-----------|
| 200    | OK |
| 201    | Criado |
| 400    | Requisição inválida |
| 404    | Não encontrado |
| 500    | Erro interno do servidor |

### Validação de dados

A API usa Zod para validação de requisições. Todos os endpoints validam dados de entrada de acordo com o seguinte schema:

```typescript
{
  titulo: string (mínimo 3 caracteres),
  conteudo: string (mínimo 10 caracteres),
  autor: {
    name: string (obrigatório),
    email: string (formato de email válido)
  }
}
```

## Estrutura do projeto

```
tc-portal-educacional/
├── src/
│   ├── __tests__/
│   │   └── post.test.js          # Suite de testes
│   ├── config/
│   │   └── database.js           # Configuração do MongoDB
│   ├── controllers/
│   │   └── postController.js     # Lógica de negócio
│   ├── models/
│   │   └── Post.js               # Modelo Mongoose
│   ├── routes/
│   │   └── postRoutes.js         # Definições de rotas
│   ├── schemas/
│   │   └── PostSchema.js         # Schemas de validação Zod
│   ├── app.js                    # Configuração da aplicação Express
│   └── server.js                 # Ponto de entrada do servidor
├── .env-example                  # Template de variáveis de ambiente
├── docker-compose.yml            # Configuração dos serviços Docker
├── Dockerfile                    # Definição da imagem Docker
├── package.json                  # Dependências e scripts
└── README.md                     # Este arquivo
```

### Descrição dos arquivos

- **`src/app.js`**: Configuração da aplicação Express com middleware e rotas
- **`src/server.js`**: Ponto de entrada da aplicação, conexão com banco de dados e inicialização do servidor
- **`src/config/database.js`**: Configuração de conexão com MongoDB usando Mongoose
- **`src/models/Post.js`**: Modelo Mongoose com definição de schema e timestamps automáticos
- **`src/controllers/postController.js`**: Lógica de negócio para todas as operações CRUD e funcionalidade de consulta
- **`src/routes/postRoutes.js`**: Definições de rotas RESTful para posts
- **`src/schemas/PostSchema.js`**: Schemas de validação Zod para integridade dos dados

## Testes

O projeto inclui testes automatizados abrangentes usando Jest e Supertest.

### Executando testes
```bash
npm test
```

### Cobertura de testes
- Criação e validação de posts
- Consulta de posts (todos e por ID)
- Atualização de posts
- Exclusão de posts
- Funcionalidade de consulta textual
- Tratamento de erros e casos extremos

### Exemplo de teste
```javascript
describe('POST /posts', () => {
  it('deve criar um novo post com sucesso', async () => {
    const novoPost = {
      titulo: 'Post de Teste',
      conteudo: 'Este é o conteúdo do post de teste',
      autor: { name: 'Autor de Teste', email: 'teste@exemplo.com' }
    };

    const response = await request(app)
      .post('/posts')
      .send(novoPost);

    expect(response.status).toBe(201);
    expect(response.body.titulo).toBe('Post de Teste');
  });
});
```

## Docker

### Usando Docker Compose
```bash
# Iniciar todos os serviços
docker-compose up -d

# Visualizar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Build manual do Docker
```bash
# Construir imagem
docker build -t tc-portal-educacional .

# Executar container
docker run -p 3000:3000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/portal_educacional \
  tc-portal-educacional
```

## Desenvolvimento

### Scripts disponíveis
```bash
npm start          # Modo de produção
npm run dev        # Modo de desenvolvimento com nodemon
npm test           # Executar suite de testes
```

## Integrantes do grupo

- Larissa Cristina de Oliveira Balera
- Gabrielly Pereira

## Relato de experiências

O desenvolvimento do projeto foi satisfatório, facilitado pela semelhança com atividades realizadas em aula. Apesar de dificuldades iniciais com Docker e GitHub Actions, devido à pouca familiaridade com essas ferramentas, conseguimos superá-las por meio de estudo e prática ao longo do processo. 

Essa experiência reforçou a importância da prática contínua, da colaboração entre os membros e da busca por soluções de forma autônoma e proativa, elementos que foram essenciais para o bom andamento e conclusão do trabalho.