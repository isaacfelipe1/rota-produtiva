# Rota Produtiva

Aplicação web em Next.js para gestão de tutores, cursos e acesso ao painel administrativo.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Docker

## Pré-requisitos

- Node.js 20+
- npm
- Docker e Docker Compose (opcional, para rodar em container)

## Instalação

Clone o projeto e acesse a pasta:

```bash
git clone <url-do-repositorio>
cd rota-produtiva
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias para a aplicação.

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> Ajuste os valores conforme a API ou serviços que a aplicação consome.

## Executar localmente

Modo de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

Build de produção:

```bash
npm run build
npm run start
```

## Executar com Docker

Build da imagem:

```bash
docker build -t rota-produtiva .
```

Rodar o container:

```bash
docker run -p 3000:3000 --env-file .env.local rota-produtiva
```

Ou com Docker Compose:

```bash
docker compose up --build
```

## Estrutura do projeto

```text
.
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── public/
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── .env.local
```

## Scripts disponíveis

```bash
npm run dev     # inicia em modo desenvolvimento
npm run build   # gera build de produção
npm run start   # inicia a aplicação em produção
npm run lint    # verifica lint do projeto
```

## Observações

- O projeto já inclui configurações para Docker e Next.js em produção.
- O arquivo `.gitignore` evita versionar dependências, cache, arquivos locais e variáveis sensíveis.
- O login do tutor fica em uma rota separada, em `/tutor/login`, e não aparece na navegação pública do site.
- A navegação pública é mantida para visitantes e páginas abertas, enquanto o acesso do tutor fica isolado em uma área específica.

## Licença

Este projeto está sob a licença definida pela equipe de desenvolvimento.
