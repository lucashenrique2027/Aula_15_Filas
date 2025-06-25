npm install amqplib
# Unifaat :: Devweb :: Aula 15 - Filas <a name=""></a>

## Instalação e Execução <a name="instalacao-e-execucao"></a>

### Siga exatamente os passos para rodar o projeto via Docker:

1. Clonar o repositório:

   ```sh
   git clone 
   ```

2. Entrar na pasta do projeto:

   ```sh
   cd TF-15
   ```

3. Criar o arquivo `.env` na raiz do projeto copiando o `.env.example`:

   > No Windows:

   ```sh
   copy .env.example .env
   ```

   > No Linux:

   ```sh
   cp .env.example .env
   ```

4. Abrir o arquivo `.env` recém criado e preencher os campos abaixo:

   ```env
   POSTGRES_USER=meu_usuario
   POSTGRES_PASSWORD=minha_senha
   RABBITMQ_USER=usuario_rabbit
   RABBITMQ_PASSWORD=senha_rabbit
   JWT_SECRET=super_secreta
   ```

5. Instalar as dependências:

```sh
npm install
```

```sh
npm install amqplib
```


6. Subir a aplicação com Docker Compose:

  > Docker Compose moderno:

```sh
docker compose up --build
```

---

## Acesse <a name="acesse"></a>

- Servidor: [http://localhost:8080](http://localhost:8080)
- Documentação da API: [http://localhost:8080/docs](http://localhost:8080/docs)

**Importante:** O arquivo `./Insomnia.yml` DEVE ser utilizado no Insomnia para testar as rotas.

---

### COMO USAR ###

Para executar esta etapa tenha o projeto rodando na sua máquina com o Docker.

Após inicializar o projeto use insomnia, Postman ou outros e insira uma requisição Login
com a seguinte URL :

  INSOMNIA:
    POST http://localhost:3000/login

  BODY:
    {
  "email": "admin@example.com",
  "senha": "senha123"
  }

No body utilize o este Mock acima, isso irá gerar um TOKEN e deve ser copiado!!!

# Reposta esperada:
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsIm5vbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MDIwODU0NiwiZXhwIjoxNzUwMjA5MTQ2fQ.crxPrMM_7-_85ObCI5RwqT6tGqewRDWcX3w1BrBdJjw",
	"expires_in": "10m"
}



Em seguida use a URL :

  INSOMNIA:
    POST http://localhost:3000/api/task

  BODY:
   {"name":"nome"}

   AUTH - BEARER TOKEN:
        <INSIRA-SEU-TOKEN-COPIADO!>

# Reposta esperada:
  {
	"message": "Job enviado para a fila com sucesso."
  }

Agora consulte os LOGS do terminal sendo o mesmo que você utilizou para executar o Docker compose up,
lá você verá a mensagem executada após passados 10 segundos.