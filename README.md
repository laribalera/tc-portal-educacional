# TC Portal Educacional

Aplicação full-stack para gerenciamento de conteúdo educacional através de posts. Composta por uma API RESTful em Node.js/Express/MongoDB e um frontend em React/Vite.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Frontend](#frontend)
- [Referência da API](#referência-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Docker](#docker)
- [Desenvolvimento](#desenvolvimento)
- [Contribuição](#contribuição)

## Visão geral

O TC Portal Educacional é uma aplicação full-stack projetada para gerenciar conteúdo educacional através de um sistema baseado em posts. A aplicação oferece operações CRUD completas para posts educacionais com validação robusta de dados, capacidades de busca e uma interface web responsiva.

### Principais funcionalidades

- Operações CRUD completas para posts educacionais
- Sistema de autenticação para professores
- Interface web responsiva com React
- Validação de dados usando schemas Zod
- Busca textual completa em títulos e conteúdo
- Testes automatizados com Jest
- Suporte à containerização com Docker
- Padrão de arquitetura MVC no backend

## Arquitetura

A aplicação segue uma arquitetura full-stack com separação clara entre frontend e backend:

### Backend (API)
Segue o padrão Model-View-Controller (MVC) com separação clara de responsabilidades:

```
backend/src/
├── config/          # Arquivos de configuração
├── controllers/     # Lógica de negócio
├── models/         # Modelos de dados (Mongoose)
├── routes/         # Definições de rotas
├── schemas/        # Validação de dados (Zod)
├── middlewares/    # Middlewares personalizados
├── __tests__/      # Testes automatizados
├── app.js          # Configuração do Express
└── server.js       # Arquivo principal do servidor
```

### Frontend
Aplicação React moderna usando Vite como bundler:

```
frontend/src/
├── app/             # Configuração da aplicação e roteamento
├── components/      # Componentes reutilizáveis
├── pages/           # Páginas da aplicação
├── services/        # Serviços para comunicação com API
├── styles/          # Estilos globais
└── utils/           # Utilitários
```

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- MongoDB (instalação local ou Atlas)
- Docker (opcional, recomendado para desenvolvimento)

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd tc-portal-educacional
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
cd ..
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
cd ..
```

## Configuração

### Backend
Crie um arquivo `.env` na pasta `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/portal_educacional
PORT=3000
JWT_SECRET=devsecret
JWT_EXPIRES_IN=7d
```

### Frontend
Crie um arquivo `.env` na pasta `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Configuração do MongoDB

#### MongoDB Local
Instale o MongoDB Community Server e inicie o serviço:
```bash
mongod
```

#### MongoDB Atlas (Recomendado)
1. Crie uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster gratuito
3. Obtenha a string de conexão
4. Atualize o `MONGO_URI` no seu arquivo `.env` do backend

## Executando a aplicação

### Modo de desenvolvimento

1. Inicie o MongoDB (local ou Atlas)

2. Execute o backend:
```bash
cd backend
npm run dev
```

3. Em outro terminal, execute o frontend:
```bash
cd frontend
npm run dev
```

O backend estará disponível em `http://localhost:3000` e o frontend em `http://localhost:5173` (porta padrão do Vite).

### Modo de produção

Para produção, utilize Docker Compose (veja seção [Docker](#docker)).

### Executando testes do backend
```bash
cd backend
npm test
```

## Frontend

O frontend é uma aplicação React moderna desenvolvida com Vite, oferecendo uma interface responsiva para o gerenciamento de conteúdo educacional.

### Tecnologias utilizadas

- **React 19**: Framework JavaScript para construção de interfaces
- **Vite**: Bundler rápido para desenvolvimento
- **React Router**: Roteamento para navegação SPA
- **Bootstrap 5**: Framework CSS para design responsivo
- **Axios**: Cliente HTTP para comunicação com a API

### Funcionalidades

- **Página inicial**: Apresentação do portal educacional
- **Sistema de autenticação**: Login para professores
- **Dashboard**: Área restrita para gerenciamento de posts
- **Gerenciamento de posts**: Criar, editar, visualizar e deletar posts
- **Busca de posts**: Funcionalidade de busca textual
- **Registro de professores**: Cadastro de novos usuários, página criada para auxiliar na avaliação do projeto, tendo em vista que o dashboard só é acessado com login. Para evitar que qualquer pessoa se cadastre, colocamos um "código de autenticação" no login
- **Interface responsiva**: Compatível com dispositivos móveis e desktop

### Estrutura de componentes

- **Páginas**: Home, Login, Dashboard, PostDetails, PostEditor, etc.
- **Componentes**: Navbar, PostCard, PostForm, SearchBar, etc.
- **Serviços**: Comunicação com API (posts, auth, professores)
- **Utilitários**: Gerenciamento de storage local

### Scripts disponíveis

```bash
cd frontend

npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Executa ESLint
```

## Referência da API

### URL Base
```
http://localhost:3000/api
```

### Autenticação
Atualmente não há autenticação implementada.

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

##### Criar Post
```http
POST /api/posts
Content-Type: application/json
```

**Corpo da requisição:**
```json
{
  "titulo": "string (mínimo 3 caracteres)",
  "conteudo": "string (mínimo 10 caracteres)",
  "materia": "string (mínimo de 1 caracteres)",
  "tags": "lista de strings",
  "autor": {
    "name": "string (obrigatório)",
    "email": "string (formato de email válido)"
  }
}
```

**Resposta (201):**
```json
{
  "_id": "string",
  "titulo": "string",
  "conteudo": "string",
  "materia": "string (mínimo de 1 caracteres)",
  "tags": "lista de strings",
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

##### Obter Todos os Posts
```http
GET /api/posts
```

**Resposta (200):**
```json
[
  {
    "_id": "string",
    "titulo": "string",
    "conteudo": "string",
    "materia": "string (mínimo de 1 caracteres)",
    "tags": "lista de strings",
    "autor": {
      "name": "string",
      "email": "string"
    },
    "createdAt": "timestamp ISO 8601",
    "updatedAt": "timestamp ISO 8601"
  }
]
```

##### Obter Post por ID
```http
GET /api/posts/:id
```

**Parâmetros:**
- `id` (string, obrigatório): ObjectId do MongoDB

**Resposta (200):**
```json
{
  "_id": "string",
  "titulo": "string",
  "conteudo": "string",
  "materia": "string (mínimo de 1 caracteres)",
  "tags": "lista de strings",
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

##### Atualizar Post
```http
PUT /api/posts/:id
Content-Type: application/json
```

**Parâmetros:**
- `id` (string, obrigatório): ObjectId do MongoDB

**Corpo da requisição:** Mesmo formato do Criar Post

**Resposta (200):** Mesmo formato do Obter Post por ID

**Respostas de erro:**
- `400`: Erro de validação
- `404`: Post não encontrado

##### Deletar Post
```http
DELETE /api/posts/:id
```

**Parâmetros:**
- `id` (string, obrigatório): ObjectId do MongoDB

**Resposta (200):**
```json
{
  "message": "Post deletado com sucesso",
  "post": {
    "_id": "string",
    "titulo": "string",
    "conteudo": "string",
    "materia": "string (mínimo de 1 caracteres)",
    "tags": "lista de strings",
    "autor": {
      "name": "string",
      "email": "string"
    }
  }
}
```

**Resposta de erro (404):**
```json
{
  "error": "Post não encontrado"
}
```

##### Buscar Posts
```http
GET /api/posts/search?q={consulta}
```

**Parâmetros de query:**
- `q` (string, obrigatório): Termo de busca

**Resposta (200):** Array de posts que correspondem aos critérios de busca

**Resposta de erro (400):**
```json
{
  "error": "parameter de busca q é obrigatório"
}
```

#### Professores

##### Login de Professor
```http
POST /api/professores/login
Content-Type: application/json
```

**Corpo da requisição:**
```json
{
  "email": "string (formato de email válido)",
  "password": "string (senha)"
}
```

**Resposta (200):**
```json
{
  "token": "string (JWT token)",
  "professor": {
    "id": "string",
    "name": "string",
    "email": "string",
    "disciplinas": ["array de strings"]
  }
}
```

**Resposta de erro (401):**
```json
{
  "message": "Credenciais inválidas."
}
```

##### Obter Professor Logado
```http
GET /api/professores/me
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "disciplinas": ["array de strings"]
}
```

##### Criar Professor
```http
POST /api/professores
Content-Type: application/json
```

**Corpo da requisição:**
```json
{
  "name": "string (obrigatório)",
  "email": "string (formato de email válido)",
  "disciplinas": ["array de strings (pelo menos uma)"],
  "senha": "string (mínimo 6 caracteres)"
}
```

**Resposta (201):**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "disciplinas": ["array de strings"],
  "createdAt": "timestamp ISO 8601",
  "updatedAt": "timestamp ISO 8601"
}
```

##### Obter Todos os Professores
```http
GET /api/professores
```

**Resposta (200):**
```json
[
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "disciplinas": ["array de strings"],
    "createdAt": "timestamp ISO 8601",
    "updatedAt": "timestamp ISO 8601"
  }
]
```

##### Obter Professor por ID
```http
GET /api/professores/:id
```

**Parâmetros:**
- `id` (string, obrigatório): ObjectId do MongoDB

**Resposta (200):** Mesmo formato do Obter Todos os Professores (objeto único)

##### Atualizar Professor
```http
PUT /api/professores/:id
Content-Type: application/json
Authorization: Bearer {token}
```

**Corpo da requisição:** Mesmo formato do Criar Professor (todos os campos opcionais)

**Resposta (200):** Mesmo formato do Obter Professor por ID

##### Deletar Professor
```http
DELETE /api/professores/:id
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "message": "Professor deletado com sucesso",
  "professor": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "disciplinas": ["array de strings"]
  }
}
```

##### Buscar Professores
```http
GET /api/professores/search?q={consulta}
```

**Parâmetros de query:**
- `q` (string, obrigatório): Termo de busca

**Resposta (200):** Array de professores que correspondem aos critérios de busca

### Códigos de status HTTP

| Código | Descrição |
|--------|-----------|
| 200    | OK |
| 201    | Criado |
| 400    | Requisição Inválida |
| 404    | Não Encontrado |
| 500    | Erro Interno do Servidor |

### Validação de dados

A API usa Zod para validação de requisições. Todos os endpoints validam dados de entrada de acordo com os seguintes schemas:

#### Schema de Posts
```typescript
{
  titulo: string (mínimo 3 caracteres),
  conteudo: string (mínimo 10 caracteres),
  materia: string (mínimo 1 caracter),
  tags: [lista de strings],
  autor: {
    name: string (obrigatório),
    email: string (formato de email válido)
  }
}
```

#### Schema de Professores (Criar)
```typescript
{
  name: string (obrigatório),
  email: string (formato de email válido),
  disciplinas: [array de strings, mínimo 1],
  senha: string (mínimo 6 caracteres)
}
```

#### Schema de Professores (Atualizar)
```typescript
{
  name?: string,
  email?: string,
  disciplinas?: [array de strings],
  senha?: string
}
```

## Estrutura do projeto

```
tc-portal-educacional/
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   └── post.test.js          # Suite de testes
│   │   ├── config/
│   │   │   └── database.js           # Configuração do MongoDB
│   │   ├── controllers/
│   │   │   ├── postController.js     # Lógica de negócio dos posts
│   │   │   └── professorController.js # Lógica de negócio dos professores
│   │   ├── middlewares/
│   │   │   └── requireAuth.js        # Middleware de autenticação
│   │   ├── models/
│   │   │   ├── Post.js               # Modelo Mongoose para posts
│   │   │   └── Professor.js          # Modelo Mongoose para professores
│   │   ├── routes/
│   │   │   ├── postRoutes.js         # Definições de rotas dos posts
│   │   │   └── professorRoutes.js    # Definições de rotas dos professores
│   │   ├── schemas/
│   │   │   ├── PostSchema.js         # Schemas de validação Zod para posts
│   │   │   └── ProfessorSchema.js    # Schemas de validação Zod para professores
│   │   ├── app.js                    # Configuração da aplicação Express
│   │   └── server.js                 # Ponto de entrada do servidor
│   ├── .env-example                  # Template de variáveis de ambiente
│   ├── docker-compose.yml            # Configuração dos serviços Docker do backend
│   ├── Dockerfile                    # Definição da imagem Docker do backend
│   └── package.json                  # Dependências e scripts do backend
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx               # Componente principal da aplicação
│   │   │   ├── AuthProvider.jsx      # Provedor de contexto de autenticação
│   │   │   ├── ProtectedRoute.jsx    # Componente para rotas protegidas
│   │   │   ├── RequireAuth.jsx       # HOC para autenticação obrigatória
│   │   │   └── routes.jsx            # Definições de rotas do frontend
│   │   ├── components/
│   │   │   ├── Breadcrumbs/          # Componente de navegação estrutural
│   │   │   ├── Button/               # Componente de botão reutilizável
│   │   │   ├── Carousel/             # Componente de carrossel
│   │   │   ├── ConfirmDialogue/      # Componente de diálogo de confirmação
│   │   │   ├── ErrorState/           # Componente para estados de erro
│   │   │   ├── Footer/               # Rodapé da aplicação
│   │   │   ├── Headers/              # Cabeçalhos das páginas
│   │   │   ├── Loading/              # Componente de loading
│   │   │   ├── Navbar/               # Barra de navegação
│   │   │   ├── Pagination/           # Componente de paginação
│   │   │   ├── PostActions/          # Ações para posts
│   │   │   ├── PostCard/             # Cartão de exibição de post
│   │   │   ├── PostForm/             # Formulário para criação/edição de posts
│   │   │   ├── PostList/             # Lista de posts
│   │   │   ├── ProfessoresAccordion/ # Acordeão para professores
│   │   │   └── SearchBar/            # Barra de busca
│   │   ├── pages/
│   │   │   ├── Dashboard/            # Página do dashboard
│   │   │   ├── Home/                 # Página inicial
│   │   │   ├── Login/                # Página de login
│   │   │   ├── PostDetails/          # Detalhes de um post
│   │   │   ├── PostEditor/           # Editor de posts
│   │   │   ├── PostSelector/         # Seletor de posts
│   │   │   ├── Professores/          # Página de professores
│   │   │   └── Register/             # Registro de professores
│   │   ├── services/
│   │   │   ├── api.js                # Configuração base da API
│   │   │   ├── auth.service.js       # Serviço de autenticação
│   │   │   ├── posts.service.js      # Serviço para posts
│   │   │   └── professores.service.js # Serviço para professores
│   │   ├── styles/
│   │   │   └── global.css            # Estilos globais
│   │   ├── utils/
│   │   │   └── storage.js            # Utilitários de storage
│   │   └── main.jsx                  # Ponto de entrada do React
│   ├── .env-example                  # Template de variáveis de ambiente
│   ├── docker-compose.yml            # Configuração dos serviços Docker do frontend (se aplicável)
│   ├── Dockerfile                    # Definição da imagem Docker do frontend
│   ├── nginx.conf                    # Configuração do Nginx para produção
│   ├── index.html                    # Template HTML principal
│   ├── package.json                  # Dependências e scripts do frontend
│   ├── vite.config.js                # Configuração do Vite
│   └── eslint.config.js              # Configuração do ESLint
├── dump/
│   └── blogdb/                       # Dump do banco de dados
├── docker-compose.yml                # Configuração completa da aplicação
├── README.md                         # Este arquivo
└── .github/
    └── workflows/                    # Workflows de CI/CD
```

## Testes

O projeto inclui testes automatizados abrangentes usando Jest e Supertest.

### Executando testes
```bash
npm test
```

### Cobertura de testes
- Criação e validação de posts
- Recuperação de posts (todos e por ID)
- Atualização de posts
- Exclusão de posts
- Funcionalidade de busca textual
- Tratamento de erros e casos extremos

### Exemplo de teste
```javascript
describe('POST /posts', () => {
  it('deve criar um novo post com sucesso', async () => {
    const novoPost = {
      titulo: 'Post de Teste',
      conteudo: 'Este é o conteúdo do post de teste',
      materia: 'Teste',
      tags: ['tag1', 'tag2'],
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

### Usando Docker Compose (Recomendado)
```bash
# Iniciar todos os serviços (backend, frontend e MongoDB)
docker-compose up -d

# Visualizar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Serviços Docker
- **mongo**: MongoDB 7.0 (porta 27017)
- **app**: API Node.js/Express (porta 3000)
- **front**: Frontend React/Nginx (porta 8080)

A aplicação estará disponível em:
- Frontend: http://localhost:8080
- API: http://localhost:3000

### Build manual do Docker

#### Backend
```bash
cd backend
docker build -t tc-portal-educacional-backend .
docker run -p 3000:3000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/portal_educacional \
  -e JWT_SECRET=devsecret \
  tc-portal-educacional-backend
```

#### Frontend
```bash
cd frontend
docker build -t tc-portal-educacional-frontend \
  --build-arg VITE_API_URL=http://localhost:3000/api .
docker run -p 8080:80 tc-portal-educacional-frontend
```

## Desenvolvimento

### Scripts disponíveis

#### Backend
```bash
cd backend
npm start          # Modo de produção
npm run dev        # Modo de desenvolvimento com nodemon
npm test           # Executar suite de testes
```

#### Frontend
```bash
cd frontend
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Executar ESLint
```

### Diretrizes de desenvolvimento
- Seguir o padrão de arquitetura MVC no backend
- Usar componentes reutilizáveis no frontend
- Escrever testes para novas funcionalidades do backend
- Usar Zod para validação de dados no backend
- Seguir convenções de API RESTful
- Manter interface responsiva no frontend
- Documentar mudanças na API e componentes

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/feature-incrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona feature incrível'`)
4. Push para a branch (`git push origin feature/feature-incrivel`)
5. Abra um Pull Request

### Diretrizes para pull requests
- Incluir testes para nova funcionalidade
- Atualizar documentação conforme necessário
- Seguir o estilo de código existente
- Fornecer descrição clara das mudanças

## Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo LICENSE para detalhes.

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Procure por issues existentes
3. Crie um novo issue com informações detalhadas

---

**Desenvolvido com ❤️ para a comunidade educacional**
