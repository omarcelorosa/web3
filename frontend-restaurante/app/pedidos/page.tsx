import FormularioPedido from '../components/FormularioPedido';
import Link from 'next/link';

// Função principal, assincrona pois precisa receber o dado da nossa api
export default async function Home() {
  // Faz a requisição para a nossa API do Express!
  const resposta = await fetch('http://localhost:3001/pedidos', { // Busca os dados da nossa API, no caso rota menu
    cache: 'no-store' // Sem cache, pega os dados diretamente da api
  });

  //Variavel cardapio armazena o resultado da nossa requisição
  const cardapio = await resposta.json();

  // return é tudo o que vai aparecer na tela
  return (
    // usamos classname no lugar de somente class
    <main className="p-10 ">
      <h1 className="text-3xl font-bold mb-6">Pedidos do Restaurante</h1>
      <ul className=" text-center text-3xl font-bold mb-6">
        {/* usa javascript dentro da pagina 
        // map percorre nosso array (quase igual um for) criando um novo bloco de html */}
        {cardapio.map((pedido, index) => (
          <li key={index} className="border p-4 mb-2 shadow-sm">
            {pedido.prato} - {pedido.status}
          </li>
        ))}
      </ul>
      <Link href="/">
        <button className="botao">Menu</button>
      </Link>
    </main>
  );
}