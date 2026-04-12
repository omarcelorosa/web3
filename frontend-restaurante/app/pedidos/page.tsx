import Link from 'next/link';
export default async function Home() {
    const resposta = await fetch('http://localhost:3000/pedidos', { // Busca os dados da nossa API, no caso rota menu
        cache: 'no-store' // Sem cache, pega os dados diretamente da api
    });
    const pedidos = await resposta.json();

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold mb-6">Pedidos da Cozinha</h1>
            <ul>
                {pedidos.map((pedidos)=>(
                <li key={pedidos.id} className="border p-4 mb - 2 shadow-sm">{pedidos.prato}-{pedidos.status}
                </li>
                ))}
            </ul>
            <Link href="/">
                <button className="botao">Menu</button>
            </Link>
        </main>
    );
}