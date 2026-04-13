'use client';

import { useState } from 'react';

export default function FormularioPedido() {
  const [prato, setPrato] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function enviarPedido(e: React.FormEvent) {
    e.preventDefault(); // NÃO recarrega a página

    try {
      const resposta = await fetch('http://localhost:3001/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prato })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.erro);
        return;
      }

      setMensagem('Pedido enviado com sucesso!');
      setPrato('');
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  }

  return (
    <div>
      <h2>Fazer Pedido</h2>

      <form onSubmit={enviarPedido}>
        <input
          type="text"
          placeholder="Digite o prato"
          value={prato}
          onChange={(e) => setPrato(e.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}