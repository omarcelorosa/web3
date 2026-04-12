export default async function Home() {
    const resposta = await fetch('http://localhost:3001/cozinha', { // Busca os dados da nossa API, no caso rota menu
        cache: 'no-store' // Sem cache, pega os dados diretamente da api
    });
}