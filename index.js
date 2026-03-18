const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Primeira novidade, importa o prisma
 
const app = express();
const port = 3000;
app.use(express.json());
 
const prisma = new PrismaClient(); // 2. Instancia o nosso "Cliente Prisma"
 
// O Cardápio continua aqui, Por enquanto ele é regra, não dado salvo
const cardapio = [
  { item: 'Macarronada', preco: 35.00 },
  { item: 'Salada Ceasar', preco: 28.00 },
  { item: 'Suco de Laranja', preco: 10.00 }
];
 
// --- ROTAS (Agora com ASYNC / AWAIT) ---
// Como ir ao banco na nuvem demora um pouco, nosso "java" vai ter que esperar (await) 
 
 
// GET - Buscar do Banco
app.get('/pedidos', async (req, res) => {
  const todosOsPedidos = await prisma.pedido.findMany(); // Prisma, busque todos!
  res.json(todosOsPedidos);
});
 
// POST - Salvar no Banco
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
 
// GET /menu continua igual, ele ainda esta em memória
app.get('/menu', (req, res) => {
  res.json(cardapio);
});

//ordenar por status
app.get('/pedidos/status/:status', async (req, res) => { //:status é um parâmetro dinâmico
  const { status } = req.params;

  const pedidos = await prisma.pedido.findMany({ //possível por conta da async (req, res) (função assíncrona), e organiza o código de forma mais limpa
    where: {
      status: status
    }
  });

  res.json(pedidos);
});

app.get('/pedidos/:id', async (req, res) => {
  const {id} = req.params;

  const pedido = await prisma.pedido.findUnique({
    where: {
      id: (id)
    }
  })
  res.json(pedido);
})

app.delete('/pedidos/:id', async (req, res) => {
  const {id} = req.params;

  await prisma.pedido.delete({
    where: {
      id: parseInt(id)
    }
  })
})

app.get('/pedidos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await prisma.pedido.findUnique({
      where: {
        id: id
      }
    });

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(pedido);

  } catch (error) { // se der eero no try vem pra cá
    res.status(400).json({ erro: "ID inválido" });
  }
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));