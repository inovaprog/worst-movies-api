# API dos Piores filmes

## Requisitos da API:

Ler o arquivo CSV dos filmes e inserir os dados em uma base de dados ao iniciar a
aplicação.

Obter o produtor com maior intervalo entre dois prêmios consecutivos, e o que
obteve dois prêmios mais rápido.

## Requisitos para execução da aplicação

- NodeJS v20.15

## Instalação

```bash
npm install
```

## Como executar:

Substituir o arquivo data/movielist.csv com os dados dos filmes seguindo o mesmo formato atual.

Para rodar em modo de desenvolvimento:

```
npm run start:dev
```


## Endpoints

### Filmes

#### 1. Listar Todos os Filmes

**GET** `/movies`

Retorna uma lista de todos os filmes.

**Exemplo de resposta**:

```json
[
  {
    "id": 3,
    "title": "Morbius",
    "year": 2022,
    "studios": "Columbia Pictures",
    "winner": false,
    "producers": ["Avi Arad", "Matt Tolmach"]
  },
  {
    "id": 2,
    "title": "The Emoji Movie",
    "year": 2017,
    "studios": "Sony Pictures Animation",
    "winner": false,
    "producers": ["Michelle Raimo Kouyate"]
  }
]
```

### Buscar Filme por ID

#### **GET** `/movies/:id`

Este endpoint retorna os detalhes de um filme específico com base no `id` fornecido.

**Parâmetros**:
- `id` (path): O ID do filme que deseja buscar (deve ser um número inteiro).

**Exemplo de Requisição**:

```
GET /movies/1
```

**Exemplo de Resposta Sucesso (200 OK)**:
```json
{
  "id": 1,
  "title": "Cats",
  "year": 2019,
  "studios": "Universal Pictures",
  "winner": false,
  "producers": ["Tom Hooper", "Debra Hayward"]
}

```

Códigos de Resposta:

 ```200 OK```: Retorna os detalhes do filme.

 ```404 Not Found```: O filme não foi encontrado.

 ```400 Bad Request```: O id fornecido não é válido (não é um número inteiro).


### Inserir um Novo Filme

#### **POST** `/movies`

Este endpoint permite inserir um novo filme no banco de dados.

**Parâmetros**:
O corpo da requisição deve conter os seguintes campos:

- `title` (string, obrigatório): O título do filme.
- `year` (number, obrigatório): O ano de lançamento do filme.
- `studios` (string, obrigatório): O studio que fez o filme.
- `winner` (boolean, obrigatório): Indica se o filme foi vencedor.
- `producers` (array de strings, obrigatório): Uma lista de nomes dos produtores do filme.

**Exemplo de Requisição**:
```json
POST /movies
{
  "title": "Movie Example",
  "year": 2021,
  "studios": "Studio Example",
  "winner": true,
  "producers": ["Producer 1", "Producer 2"]
}
```

Códigos de Resposta:

 ```200 OK```: Retorna os detalhes do filme.

 ```500 Internal Server Error```: Erro inesperado no sistema.

 ```400 Bad Request```: Algum dos campos não é valido.


### Atualizar um Filme

#### **PUT** `/movies/:id`

Este endpoint permite atualizar as informações de um filme existente no banco de dados, identificado pelo seu `id`.

**Parâmetros**:

- `id` (number, obrigatório): O ID do filme que será atualizado. Esse parâmetro deve ser passado na URL.

O corpo da requisição pode conter os seguintes campos:

- `title` (string, opcional): O novo título do filme.
- `year` (number, opcional): O novo ano de lançamento do filme.
- `studios` (string, opcional): O studio que fez o filme.
- `winner` (boolean, opcional): Indica se o filme foi vencedor.
- `producers` (array de strings, opcional): Uma lista de novos produtores do filme.

**Exemplo de Requisição**:
```json
PUT /movies/1
{
  "title": "Updated Movie Example",
  "year": 2022,
  "winner": false,
  "producers": ["Producer 3"]
}
```

### Deletar um Filme

#### **DELETE** `/movies/:id`

Este endpoint permite deletar um filme existente no banco de dados, identificado pelo seu `id`.

**Parâmetros**:

- `id` (number, obrigatório): O ID do filme que será deletado. Esse parâmetro deve ser passado na URL.

**Exemplo de Requisição**:
```http
DELETE /movies/1
```

Códigos de Resposta:

 ```200 OK```: Filme apagado com sucesso.

 ```500 Internal Server Error```: Erro inesperado no sistema.

 ```400 Bad Request```: O campo de ID não é válido.

 ### Obter Intervalos de Produtores Vencedores

#### **GET** `/movies/winners/intervals`

Este endpoint retorna os produtores que ganharam prêmios mais de uma vez, exibindo o intervalo mínimo e máximo entre as vitórias.

**Resposta**:
A resposta contém dois arrays: `min` e `max`. O array `min` contém os produtores com os menores intervalos entre as vitórias, enquanto o array `max` contém os produtores com os maiores intervalos entre as vitórias.

**Exemplo de Requisição**:
```http
GET /movies/winners/intervals
```

**Exemplo de resposta**
```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    },
    {
      "producer": "Producer 2",
      "interval": 1,
      "previousWin": 2018,
      "followingWin": 2019
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    },
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 2000,
      "followingWin": 2099
    }
  ]
}
```

### Testes de integração
Os testes de integração estão disponíveis em /tests/ 

Existe um arquivo csv exclusivo para os testes que cria uma integração de ponta a ponta.
#### Executando os testes de integração:
```

npm run test

```

