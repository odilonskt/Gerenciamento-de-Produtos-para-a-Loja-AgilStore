import fs from "fs";
import readline from "readline";
import { v4 as uuid } from "uuid";

// Criar interface readline para entrada/saída
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/* =======================
   CLASSE
======================= */
class Produto {
  constructor(nome, categoria, quantidade, preco) {
    this.id = uuid();
    this.nome = nome;
    this.categoria = categoria;
    this.quantidade = quantidade;
    this.preco = preco;
  }
}

/* =======================
   DADOS
======================= */
let registros = [];
const ARQUIVO_JSON = "produtos.json";

/* =======================
   FUNÇÕES DE ARQUIVO
======================= */

// Carregar dados do arquivo JSON
const carregarDados = () => {
  try {
    if (fs.existsSync(ARQUIVO_JSON)) {
      const dados = fs.readFileSync(ARQUIVO_JSON, "utf8");
      registros = JSON.parse(dados);
      console.log(`📂 Dados carregados: ${registros.length} produtos`);
    }
  } catch (error) {
    console.log(
      "⚠️  Não foi possível carregar os dados. Iniciando com lista vazia."
    );
  }
};

// Salvar dados no arquivo JSON
const salvarDados = () => {
  try {
    fs.writeFileSync(ARQUIVO_JSON, JSON.stringify(registros, null, 2));
    console.log("💾 Dados salvos com sucesso!");
  } catch (error) {
    console.log("❌ Erro ao salvar dados:", error.message);
  }
};

/* =======================
   FUNÇÕES SINCRONAS
======================= */

// Função auxiliar para fazer perguntas usando callbacks
const question = (query, callback) => {
  rl.question(query, (answer) => {
    callback(answer);
  });
};

// Função para fazer múltiplas perguntas em sequência
const fazerPerguntas = (perguntas, index, respostas, callback) => {
  if (index >= perguntas.length) {
    callback(respostas);
    return;
  }

  question(perguntas[index], (resposta) => {
    respostas.push(resposta);
    fazerPerguntas(perguntas, index + 1, respostas, callback);
  });
};

// CREATE
const cadastrarProduto = () => {
  console.log("\n📝 CADASTRO DE PRODUTO");

  fazerPerguntas(
    ["Nome: ", "Categoria: ", "Quantidade: ", "Preço: "],
    0,
    [],
    (respostas) => {
      const [nome, categoria, quantidadeStr, precoStr] = respostas;
      const quantidade = Number(quantidadeStr);
      const preco = Number(precoStr);

      if (!nome.trim() || !categoria.trim()) {
        console.log("❌ Nome e categoria são obrigatórios.");
        mostrarMenuAposPausa();
        return;
      }

      if (isNaN(quantidade) || quantidade <= 0 || isNaN(preco) || preco <= 0) {
        console.log(
          "❌ Quantidade e preço devem ser números válidos maiores que zero."
        );
        mostrarMenuAposPausa();
        return;
      }

      const produto = new Produto(nome, categoria, quantidade, preco);
      registros.push(produto);
      salvarDados();

      console.log("✅ Produto cadastrado com sucesso!");
      console.log(`🆔 ID do produto: ${produto.id}`);
      mostrarMenuAposPausa();
    }
  );
};

// Função para exibir tabela de produtos
const exibirTabelaProdutos = (produtos = registros) => {
  if (produtos.length === 0) {
    console.log("📭 Nenhum produto para exibir.");
    return false;
  }

  console.log("\n" + "=".repeat(100));
  console.log(
    "ID".padEnd(10) +
      " | Nome".padEnd(20) +
      " | Categoria".padEnd(15) +
      " | Quantidade".padEnd(10) +
      " | Preço".padEnd(10) +
      " | Valor Total"
  );
  console.log("=".repeat(100));

  produtos.forEach((produto, index) => {
    const idExibicao = produto.id.substring(0, 8);
    const valorTotal = produto.quantidade * produto.preco;

    console.log(
      `${idExibicao.padEnd(10)} | ${produto.nome.padEnd(
        20
      )} | ${produto.categoria.padEnd(15)} | ${produto.quantidade
        .toString()
        .padEnd(10)} | R$ ${produto.preco
        .toFixed(2)
        .padStart(8)} | R$ ${valorTotal.toFixed(2).padStart(8)}`
    );
  });

  console.log("=".repeat(100));
  console.log(`📊 Total: ${produtos.length} produto(s)`);
  return true;
};

// READ - Exibe produtos com tabela formatada
const listarProdutos = () => {
  console.log("\n📦 LISTA DE PRODUTOS");
  exibirTabelaProdutos();
  mostrarMenuAposPausa();
};

// Função auxiliar para buscar produto por ID
const buscarProdutoPorId = (id) => {
  return registros.find((produto) => produto.id === id);
};

// Função auxiliar para exibir detalhes de um produto
const exibirDetalhesProduto = (produto) => {
  console.log("\n📋 DETALHES DO PRODUTO");
  console.log("=".repeat(60));
  console.log(`🆔 ID: ${produto.id}`);
  console.log(`📛 Nome: ${produto.nome}`);
  console.log(`🏷️  Categoria: ${produto.categoria}`);
  console.log(`📦 Quantidade: ${produto.quantidade}`);
  console.log(`💰 Preço unitário: R$ ${produto.preco.toFixed(2)}`);
  console.log(
    `💵 Valor total em estoque: R$ ${(
      produto.quantidade * produto.preco
    ).toFixed(2)}`
  );
  console.log("=".repeat(60));
};

// Função para buscar e exibir produto com tabela
const buscarEExibirProduto = (id, operacao = "visualizar") => {
  const produto = buscarProdutoPorId(id);

  if (!produto) {
    console.log("❌ Produto não encontrado. Verifique o ID.");
    return null;
  }

  console.log(`\n🔍 Produto para ${operacao}:`);
  console.log("=".repeat(60));

  // Exibir tabela com apenas este produto
  const tabelaProduto = [produto];
  exibirTabelaProdutos(tabelaProduto);

  return produto;
};

// FILTER
const filtrarPorCategoria = () => {
  console.log("\n🔍 FILTRAR POR CATEGORIA");

  question("Digite a categoria: ", (categoria) => {
    const filtrados = registros.filter(
      (produto) => produto.categoria.toLowerCase() === categoria.toLowerCase()
    );

    if (filtrados.length === 0) {
      console.log(`Nenhum produto encontrado na categoria "${categoria}".`);
      mostrarMenuAposPausa();
      return;
    }

    console.log(`\n📋 Produtos na categoria "${categoria}":`);
    exibirTabelaProdutos(filtrados);
    mostrarMenuAposPausa();
  });
};

// Função auxiliar para editar produto por ID
const editarProdutoPorId = (id) => {
  const produto = buscarEExibirProduto(id, "edição");

  if (!produto) {
    mostrarMenuAposPausa();
    return;
  }

  console.log("\n✏️  EDITAR PRODUTO");
  console.log("Deixe em branco para manter o valor atual.");

  fazerPerguntas(
    [
      `Nome (${produto.nome}): `,
      `Categoria (${produto.categoria}): `,
      `Quantidade (${produto.quantidade}): `,
      `Preço (R$ ${produto.preco.toFixed(2)}): `,
    ],
    0,
    [],
    (respostas) => {
      const [nome, categoria, quantidadeStr, precoStr] = respostas;

      // Atualizar apenas se o usuário digitou algo
      let alteracoes = [];

      if (nome.trim() && nome.trim() !== produto.nome) {
        produto.nome = nome.trim();
        alteracoes.push(`Nome: ${produto.nome}`);
      }

      if (categoria.trim() && categoria.trim() !== produto.categoria) {
        produto.categoria = categoria.trim();
        alteracoes.push(`Categoria: ${produto.categoria}`);
      }

      if (quantidadeStr.trim()) {
        const quantidade = Number(quantidadeStr);
        if (
          !isNaN(quantidade) &&
          quantidade >= 0 &&
          quantidade !== produto.quantidade
        ) {
          produto.quantidade = quantidade;
          alteracoes.push(`Quantidade: ${produto.quantidade}`);
        } else if (isNaN(quantidade) || quantidade < 0) {
          console.log("❌ Quantidade inválida. Mantendo valor anterior.");
        }
      }

      if (precoStr.trim()) {
        const preco = Number(precoStr);
        if (!isNaN(preco) && preco >= 0 && preco !== produto.preco) {
          produto.preco = preco;
          alteracoes.push(`Preço: R$ ${produto.preco.toFixed(2)}`);
        } else if (isNaN(preco) || preco < 0) {
          console.log("❌ Preço inválido. Mantendo valor anterior.");
        }
      }

      if (alteracoes.length > 0) {
        salvarDados();
        console.log("\n✅ Produto atualizado com sucesso!");
        console.log("Alterações realizadas:");
        alteracoes.forEach((alteracao, index) => {
          console.log(`  ${index + 1}. ${alteracao}`);
        });

        console.log("\n📋 Produto atualizado:");
        buscarEExibirProduto(id, "visualização");
      } else {
        console.log("\nℹ️  Nenhuma alteração realizada.");
      }

      mostrarMenuAposPausa();
    }
  );
};

// UPDATE - Agora por ID
const editarProduto = () => {
  console.log("\n✏️ EDITAR PRODUTO");

  if (registros.length === 0) {
    console.log("📭 Nenhum produto cadastrado.");
    mostrarMenuAposPausa();
    return;
  }

  console.log("\n📋 LISTA DE PRODUTOS DISPONÍVEIS:");
  exibirTabelaProdutos();

  question(
    "\nDigite o ID do produto (ou 'listar' para ver IDs completos): ",
    (id) => {
      // Opção para listar IDs completos
      if (id.toLowerCase() === "listar") {
        console.log("\n📋 LISTA COMPLETA DE IDs:");
        registros.forEach((produto) => {
          console.log(`${produto.id} - ${produto.nome}`);
        });

        question("\nDigite o ID completo do produto: ", (idCompleto) => {
          editarProdutoPorId(idCompleto);
        });
      } else {
        editarProdutoPorId(id);
      }
    }
  );
};

// DELETE - Agora por ID
const excluirProduto = () => {
  console.log("\n🗑️ EXCLUIR PRODUTO");

  if (registros.length === 0) {
    console.log("📭 Nenhum produto cadastrado.");
    mostrarMenuAposPausa();
    return;
  }

  console.log("\n📋 LISTA DE PRODUTOS DISPONÍVEIS:");
  exibirTabelaProdutos();

  question("\nDigite o ID do produto para excluir: ", (id) => {
    const produto = buscarEExibirProduto(id, "exclusão");

    if (!produto) {
      mostrarMenuAposPausa();
      return;
    }

    question(
      `\n⚠️  TEM CERTEZA ABSOLUTA que deseja excluir PERMANENTEMENTE "${produto.nome}"? (s/N): `,
      (confirmacao) => {
        if (confirmacao.toLowerCase() === "s") {
          const index = registros.findIndex((p) => p.id === id);
          const produtoRemovido = registros.splice(index, 1)[0];
          salvarDados();

          console.log("\n✅ Produto excluído permanentemente!");
          console.log("Produto removido:");
          console.log(`  Nome: ${produtoRemovido.nome}`);
          console.log(`  Categoria: ${produtoRemovido.categoria}`);
          console.log(`  Quantidade: ${produtoRemovido.quantidade}`);
          console.log(`  Preço: R$ ${produtoRemovido.preco.toFixed(2)}`);

          console.log("\n📊 Status atual:");
          console.log(`  Produtos restantes: ${registros.length}`);
        } else {
          console.log("❌ Operação cancelada.");
        }
        mostrarMenuAposPausa();
      }
    );
  });
};

// Buscar produto por ID
const buscarProdutoPorIdMenu = () => {
  console.log("\n🔎 BUSCAR PRODUTO POR ID");

  if (registros.length === 0) {
    console.log("📭 Nenhum produto cadastrado.");
    mostrarMenuAposPausa();
    return;
  }

  question("Digite o ID do produto: ", (id) => {
    buscarEExibirProduto(id, "visualização");
    mostrarMenuAposPausa();
  });
};

// Exportar dados para JSON
const exportarDados = () => {
  console.log("\n📤 EXPORTAR DADOS");

  if (registros.length === 0) {
    console.log("📭 Nenhum produto para exportar.");
    mostrarMenuAposPausa();
    return;
  }

  const nomeArquivo = `produtos_export_${Date.now()}.json`;

  try {
    fs.writeFileSync(nomeArquivo, JSON.stringify(registros, null, 2));
    console.log(`✅ Dados exportados para: ${nomeArquivo}`);
    console.log(`📊 Total de produtos exportados: ${registros.length}`);
  } catch (error) {
    console.log("❌ Erro ao exportar dados:", error.message);
  }

  mostrarMenuAposPausa();
};

/* =======================
   FUNÇÕES DE MENU
======================= */
const exibirMenu = () => {
  console.log(`
╔══════════════════════════════════════════════╗
║        📦 SISTEMA DE PRODUTOS               ║
╠══════════════════════════════════════════════╣
║ 1️⃣  - Cadastrar produto                    ║
║ 2️⃣  - Listar produtos                      ║
║ 3️⃣  - Buscar produto por ID                ║
║ 4️⃣  - Filtrar por categoria                ║
║ 5️⃣  - Editar produto (por ID)              ║
║ 6️⃣  - Excluir produto (por ID)             ║
║ 7️⃣  - Exportar dados para JSON             ║
║ 0️⃣  - Sair                                 ║
╚══════════════════════════════════════════════╝
`);
  console.log(`📊 Produtos cadastrados: ${registros.length}`);
  console.log(`💾 Arquivo de dados: ${ARQUIVO_JSON}`);
};

// Função para mostrar menu após pausa
const mostrarMenuAposPausa = () => {
  question("\n↵ Pressione Enter para continuar...", () => {
    mostrarMenu();
  });
};

// Função principal do menu
const mostrarMenu = () => {
  console.clear();
  exibirMenu();

  question("Escolha uma opção: ", (opcao) => {
    switch (opcao) {
      case "1":
        cadastrarProduto();
        break;
      case "2":
        listarProdutos();
        break;
      case "3":
        buscarProdutoPorIdMenu();
        break;
      case "4":
        filtrarPorCategoria();
        break;
      case "5":
        editarProduto();
        break;
      case "6":
        excluirProduto();
        break;
      case "7":
        exportarDados();
        break;
      case "0":
        console.log("\n👋 Saindo do sistema...");
        console.log(`📊 Total de produtos cadastrados: ${registros.length}`);
        salvarDados();
        rl.close();
        break;
      default:
        console.log("❌ Opção inválida!");
        mostrarMenuAposPausa();
    }
  });
};

// Iniciar o sistema
console.log("🚀 Iniciando Sistema de Gerenciamento de Produtos...");
carregarDados();
mostrarMenu();
