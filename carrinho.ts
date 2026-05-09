type Produto = {
  id: number;
  nome: string;
  preco: number;
  emEstoque: boolean;
};

const carrinho: Produto[] = [
  {
    id: 1,
    nome: "Macarronada",
    preco: 35.00,
    emEstoque: true
  },
  {
    id: 2,
    nome: "Salada Caesar",
    preco: 28.00,
    emEstoque: true
  },
  {
    id: 3,
    nome: "Suco de Laranja",
    preco: 10.00,
    emEstoque: false
  }
];

// ========================================
// FUNÇÃO: calcular total do carrinho
// ========================================
function calcularTotal(carrinho: Produto[]): number {
  let total = 0;

  carrinho.forEach((produto) => {
    total += produto.preco;
  });

  return total;
}

// ========================================
// FUNÇÃO: aplicar desconto em porcentagem
// ========================================
  //const porcentagem = 25
function aplicarDesconto(total: number, porcentagem: number): number {
  const desconto = total * (porcentagem / 100);

  return total - desconto;
}

// ========================================
// USANDO AS FUNÇÕES
// ========================================

const totalCarrinho = calcularTotal(carrinho);

console.log("Total sem desconto:", totalCarrinho);

// const totalComDesconto = aplicarDesconto(totalCarrinho, porcentagem);
const totalComDesconto = aplicarDesconto(totalCarrinho, 50);

console.log("Total com desconto:", totalComDesconto);