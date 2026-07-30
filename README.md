# planeamos.pt — Plataforma de Nutrição e Treino Personalizado

Aplicação Full-Stack desenvolvida em Node.js / Express + React + Vite + Tailwind CSS e Inteligência Artificial Gemini.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js**: Versão `>= 18.0.0`
- **npm**: Versão `>= 9.0.0`
- **Git**: Para envio para o GitHub

### 2. Instalação de Dependências
Após descompactar o ficheiro ZIP ou clonar o repositório, abra o terminal no diretório do projeto e execute:

```bash
npm install
```

### 3. Configuração do Ficheiro de Ambiente (`.env`)
Copie o ficheiro `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o ficheiro `.env` e adicione a sua chave da API da Gemini (opcional, existe um gerador local de apoio caso não defina chave):

```env
GEMINI_API_KEY="A_SUA_CHAVE_GEMINI_AQUI"
APP_URL="http://localhost:3000"
PORT=3000
```

### 4. Executar em Modo de Desenvolvimento
Para iniciar o servidor de desenvolvimento com recarregamento automático:

```bash
npm run dev
```

Aceda no navegador a: [http://localhost:3000](http://localhost:3000)

### 5. Compilar para Produção (Build)
Para testar o build de produção localmente:

```bash
npm run build
npm start
```

---

## 📦 Como Enviar para o GitHub

Se descarregou o ZIP do projeto e quer publicar no GitHub:

1. **Abra o terminal na pasta do projeto**
2. **Inicialize o repositório Git**:
   ```bash
   git init
   ```
3. **Adicione todos os ficheiros ao Git**:
   ```bash
   git add .
   ```
4. **Crie o primeiro commit**:
   ```bash
   git commit -m "Initial commit - planeamos.pt"
   ```
5. **Crie um novo repositório no [GitHub](https://github.com/new)** (não selecione adicionar README ou .gitignore no GitHub)
6. **Ligue o repositório local ao GitHub e faça push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU_UTILIZADOR/SEU_REPOSITORIO.git
   git push -u origin main
   ```

---

## 🛠️ Resolução de Problemas Comuns

- **Erro `Module not found`**: Garanta que executou `npm install` após descompactar o ZIP.
- **Erro de porta `EADDRINUSE`**: O servidor tenta escutar na porta 3000 ou na variável de ambiente `PORT`. Garanta que a porta não está ocupada por outra aplicação.
- **Ficheiros pesados no Git**: O ficheiro `.gitignore` já está configurado para ignorar a pasta `node_modules/` e a pasta `dist/`. Nunca adicione estas pastas ao GitHub.
