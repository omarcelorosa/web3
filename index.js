// Colocar sempre no topo
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Indicar o nome do arquivo

const express = require('express');
const cors = require('cors'); // Importa o CORS
const { PrismaClient } = require('@prisma/client'); // Primeira novidade, importa o prisma

const app = express();
const port = 3001
;
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json());

const prisma = new PrismaClient(); // 2. Instancia o nosso "Cliente Prisma"

// O Cardápio continua aqui, Por enquanto ele é regra, não dado salvo
const cardapio = [
  { item: 'Macarronada', preco: 35.00 },
  { item: 'Salada Ceasar', preco: 28.00 },
  { item: 'Suco de Laranja', preco: 10.00 }
];

// Antes das rotas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//npm install swagger-ui-express

// --- ROTAS (Agora com ASYNC / AWAIT) ---
// Como ir ao banco na nuvem demora um pouco, nosso "java" vai ter que esperar (await) 


// =======================================================
// 1. GET: Rota que busca todos os pedidos
// =======================================================
app.get('/pedidos', async (req, res) => {
  const todosOsPedidos = await prisma.pedido.findMany(); // Prisma, busque todos!
  res.json(todosOsPedidos);
});


// =======================================================
// 2. POST: Rota que cadastra um pedido
// =======================================================
app.post('/pedidos', async (req, res) => {
  const { prato } = req.body; 

  // Validações que já fizemos continuam aqui
  if (!prato || prato.trim() === "") {
    return res.status(400).json({ erro: "O nome do prato é obrigatório!" });
  }

  const pratoExisteNoMenu = cardapio.some(produto => 
    produto.item.toLowerCase() === prato.toLowerCase()
  );

  if (!pratoExisteNoMenu) {
    return res.status(400).json({ erro: `A cozinha não possui '${prato}' no cardápio.` });
  }

  // Aqui a nova mágica acontece
  const novoPedido = await prisma.pedido.create({
    data: {
      prato: prato
      // Não passamos o ID nem o status. O Prisma cuida disso pra nós
    }
  });

  res.status(201).json(novoPedido);
});


// =======================================================
// 3. GET /menu - continua igual, ele ainda esta em memória
// =======================================================
app.get('/menu', (req, res) => {
  res.json(cardapio);
});



// =======================================================
// 4. GET POR ID: Rota que busca um pedido especifico
// =======================================================
app.get('/pedidos/:id', async (req, res) => {
  // Lembrete para a turma: Adeus parseInt! O ID do Mongo é uma String.
  const { id } = req.params; 

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: id }
    });

    // O Prisma retorna 'null' se pesquisar um ID válido que não existe
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado na cozinha.' });
    }

    res.json(pedido);
  } catch (error) {
    // Se o garçom digitar um ID que não tem o formato do MongoDB (ObjectId), cai aqui
    res.status(400).json({ erro: 'Formato de ID inválido.' });
  }
});


// =======================================================
// 5. PUT: Atualizar um pedido (Apenas mudança de status)
// =======================================================
app.put('/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  
  // 1. Recebemos APENAS o status do corpo da requisição
  const { status } = req.body; 

  // 2. Trava de segurança: e se enviarem o JSON vazio?
  if (!status || status.trim() === "") {
    return res.status(400).json({ erro: 'O novo status é obrigatório para atualização.' });
  }

  try {
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: id },
      data: { 
        status: status // 3. O Prisma vai alterar SOMENTE este campo no banco
      }
    });

    res.json(pedidoAtualizado);
  } catch (error) {
    // O método update() é "chato". Se o ID não existir no banco, ele gera um erro!
    res.status(404).json({ erro: 'Pedido não encontrado para atualização.' });
  }
});


// =======================================================
// 6. DELETE: Cancelar/Excluir um pedido do sistema
// =======================================================
app.delete('/pedidos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pedido.delete({
      where: { id: id }
    });

    // Código 204 significa "No Content". A ação deu certo e não há o que devolver na tela.
    res.status(204).send(); 
  } catch (error) {
    // Igual ao update, se tentar deletar o que não existe, o Prisma grita e cai no catch.
    res.status(404).json({ erro: 'Pedido não encontrado para exclusão.' });
  }
});


// =======================================================
// 7. GET /pedidos/status/:status: Rota Bônus: Filtrar pedidos por status (Ex: GET /pedidos/status/preparando)
// =======================================================
// 
app.get('/pedidos/status/:status', async (req, res) => {
  const { status } = req.params; // Pega o status digitado na URL

  try {
    const pedidosFiltrados = await prisma.pedido.findMany({
      where: { 
        status: status // O campo do banco deve bater com o parâmetro da URL
      }
    });

    // Bônus do bônus: Se não achar nenhum com aquele status, avisa!
    if (pedidosFiltrados.length === 0) {
      return res.status(404).json({ mensagem: `Nenhum pedido com o status '${status}' encontrado.` });
    }

    res.json(pedidosFiltrados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar pedidos por status.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});