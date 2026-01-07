# 📦 Sistema de Gerenciamento de Produtos – AgilStore

Sistema de **gerenciamento de produtos via terminal**, desenvolvido em **Node.js (ES6)**, com persistência de dados em arquivo **JSON**.  
O projeto simula um controle simples de estoque, permitindo cadastrar, listar, buscar, filtrar, editar, excluir e exportar produtos.

Ideal para estudo de:

- Lógica de programação
- CRUD
- Manipulação de arquivos
- Programação orientada a objetos
- Entrada de dados no terminal

---

## 🚀 Funcionalidades

- ✅ Cadastrar produtos
- 📋 Listar produtos em tabela formatada
- 🔎 Buscar produto por **ID**
- 🏷️ Filtrar produtos por **categoria**
- ✏️ Editar produtos por **ID**
- 🗑️ Excluir produtos com confirmação
- 💾 Persistência de dados em arquivo `produtos.json`
- 📤 Exportar dados para um novo arquivo JSON
- 📊 Exibição de valor total em estoque
- 🧭 Menu interativo no terminal

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (ES Modules)
- **JavaScript (ES6+)**
- **fs** (File System)
- **readline**
- **uuid** (geração de IDs únicos)
- **nodemon** (opcional, para desenvolvimento)

---

## 📂 Estrutura do Projeto

```text
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## ▶️ Como rodar o projeto

Siga os passos abaixo para executar o sistema de gerenciamento de produtos no seu computador.

---

### 1️⃣ Verifique se o Node.js está instalado

No terminal, execute:

```bash
npm i
npm start
or
node index.js

```
