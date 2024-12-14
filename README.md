Projeto Banking Backend

Este repositório contém o backend de um sistema bancário desenvolvido com NestJS, utilizando Prisma como ORM e SQLite como banco de dados.

Requisitos

Node.js v18.20.4 ou superior

Gerenciador de pacotes npm

SQLite para banco de dados

Mock backend configurado nos seguintes endpoints:

http://localhost:8080/mock-auth/token

http://localhost:8080/mock-transfer

http://localhost:8080/mock-account/open

Configuração do Ambiente

Clone o repositório:

git clone https://github.com/HugoDeSouzaCaramez/banking-backend.git
cd banking-backend

Instale as dependências:

npm install

Configure o arquivo .env na raiz do projeto:

JWT_SECRET=17f8823b803a3663b97f4c7fda16d996c9408abb81fa2bfe0de3ef1d6bc460a6fb95c79124eec38738e1c812fbf3b6a5bc7ecf2ee106ace41aa2cf3098920f98
MOCK_AUTH_URL=http://localhost:8080/mock-auth/token
MOCK_TRANSFER_URL=http://localhost:8080/mock-transfer
MOCK_ACCOUNT_URL=http://localhost:8080/mock-account/open
MOCK_CLIENT_ID=test
MOCK_CLIENT_SECRET=secret

Configure o Prisma:

Gere o arquivo de configuração do Prisma e sincronize o banco:

npx prisma init
npx prisma migrate dev --name init

Como Rodar a Aplicação

Inicie o servidor:

npm run start

O servidor estará disponível em http://localhost:3000.

Acesse a documentação Swagger UI em:

http://localhost:3000/api/docs

Executando Testes

Testes unitários:

npm run test

Cobertura de testes:

npm run test:cov

Integração com Mock Backend

Certifique-se de que o mock backend esteja rodando nos seguintes endpoints:

Autenticação:

http://localhost:8080/mock-auth/token

Transferências:

http://localhost:8080/mock-transfer

Criação de conta:

http://localhost:8080/mock-account/open

Verifique se as portas não estão em uso antes de iniciar o mock backend.

Dependências Principais

NestJS: Framework para desenvolvimento de aplicações Node.js escaláveis

Prisma: ORM para manipulação do banco de dados

SQLite: Banco de dados relacional utilizado no projeto

Swagger: Ferramenta para documentação e testes de APIs

JWT: Autenticação baseada em tokens

Consulte o arquivo package.json para a lista completa de dependências.

Observações

Personalize as credenciais do arquivo .env conforme necessário.

A documentação Swagger está configurada para incluir autenticação JWT.

Use o Insomnia ou ferramentas semelhantes para testar os endpoints manualmente, caso prefira.

Para dúvidas ou melhorias, entre em contato com o desenvolvedor.