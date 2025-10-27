
> Nota: A estrutura do corpo das requisições foi alterada após a entrega do tech challenge - fase 2 mesmo sem a avaliação do professor ter sido feita. Esta alteração foi para que o projeto se adaptasse melhor ao desenvolvimento em progresso do front end da aplicação. Para referencia de como o projeto estava anteriormente, consultar a branch [/feature/documentation](https://github.com/laribalera/tc-portal-educacional/tree/feature/documentation)

# TC Portal Educacional API

API RESTful para gerenciamento de conteúdo educacional através de posts. Desenvolvida com Node.js, Express, MongoDB e validação com Zod.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Referência da API](#referência-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Docker](#docker)
- [Desenvolvimento](#desenvolvimento)
- [Contribuição](#contribuição)

## Visão geral

O TC Portal Educacional é uma API RESTful projetada para gerenciar conteúdo educacional através de um sistema baseado em posts. A aplicação oferece operações CRUD completas para posts educacionais com validação robusta de dados e capacidades de busca.

### Principais funcionalidades

- Operações CRUD completas para posts educacionais
- Validação de dados usando schemas Zod
- Busca textual completa em títulos e conteúdo
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
- MongoDB (instalação local ou Atlas)
- Docker (opcional)

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
4. Atualize o `MONGO_URI` no seu arquivo `.env`

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

O servidor estará disponível em `http://localhost:3000`

## Referência da API

### URL Base
```
http://localhost:3000
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
POST /posts
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
GET /posts
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
GET /posts/:id
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
PUT /posts/:id
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
DELETE /posts/:id
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
GET /posts/search?q={consulta}
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

### Códigos de status HTTP

| Código | Descrição |
|--------|-----------|
| 200    | OK |
| 201    | Criado |
| 400    | Requisição Inválida |
| 404    | Não Encontrado |
| 500    | Erro Interno do Servidor |

### Validação de dados

A API usa Zod para validação de requisições. Todos os endpoints validam dados de entrada de acordo com o seguinte schema:

```typescript
{
  titulo: string (mínimo 3 caracteres),
  conteudo: string (mínimo 10 caracteres),
  "materia": string (mínimo de 1 caracteres),
  "tags": [lista de strings],
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
- **`src/controllers/postController.js`**: Lógica de negócio para todas as operações CRUD e funcionalidade de busca
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

### Serviços Docker
- **app**: Aplicação Node.js (porta 3000)
- **mongo**: MongoDB 7.0 (porta 27017)
- **volumes**: Persistência de dados

## Desenvolvimento

### Scripts disponíveis
```bash
npm start          # Modo de produção
npm run dev        # Modo de desenvolvimento com nodemon
npm test           # Executar suite de testes
```

### Diretrizes de desenvolvimento
- Seguir o padrão de arquitetura MVC
- Escrever testes para novas funcionalidades
- Usar Zod para validação de dados
- Seguir convenções de API RESTful
- Documentar mudanças na API

### Estilo de código
- Usar indentação consistente (2 espaços)
- Seguir padrões JavaScript ES6+
- Usar nomes significativos para variáveis e funções
- Adicionar comentários para lógica complexa

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
