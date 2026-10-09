# Assincronismo e Consumo de APIs (Sprint 5)

Este projeto engloba a resolução prática dos desafios de JS da Sprint 5. Ele consolida conceitos cruciais do desenvolvimento frontend, como o Event Loop, manipulação de Promises com `async/await`, consumo de APIs REST e a gestão segura dos estados de uma tela.

## 🚀 O que foi desenvolvido

- **Parte 1 (Dados e Arrays):** Uso do `filter`, `map` e `reduce` para processar dados brutos, limpar ruídos (pedidos não numéricos ou vazios) e apresentar um faturamento formatado no DOM.
- **Parte 2 (Buscador ViaCEP):** Um app que consome dados da ViaCEP. Trata erros de rede, timeout (`AbortSignal`), e cenários em que o CEP não existe. Há também a renderização de um histórico local.
- **Parte 3 (Pokédex):** Consumo da PokéAPI. Demonstra a importância de verificar manualmente o `response.ok` no fetch para lidar adequadamente com erros HTTP, como o Status 404 (Pokémon não encontrado).

## 🛡️ Segurança Aplicada
Todos os dados retornados de fontes externas (APIs e Inputs do usuário) foram renderizados na interface utilizando `document.createElement()` e `textContent`. O uso de `innerHTML` foi evitado para blindar a aplicação contra vulnerabilidades de injeção de código (XSS).

---

## 🧠 Reflexão Final: Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?

No ecossistema do JavaScript, o assincronismo nos permite não travar a linha principal de execução (Main Thread). Porém, a forma como orquestramos as Promises faz toda a diferença na performance da aplicação.

Quando utilizamos **vários `await` em sequência**, estamos dizendo ao JavaScript:
1. Inicie a requisição A.
2. *Pause a execução e espere a requisição A terminar*.
3. Somente depois, inicie a requisição B.
4. *Espere B terminar*.

Se A demora 2 segundos e B demora 3 segundos, o processo todo levará **5 segundos**.

Quando utilizamos **`Promise.all([reqA, reqB])`**, nós disparamos todas as requisições em **paralelo**. Como não estamos esperando uma terminar para começar a outra, as requisições correm juntas pela rede. O tempo total de espera será baseado apenas na requisição mais lenta. No exemplo anterior, o processo inteiro seria concluído em apenas **3 segundos**, aproveitando muito melhor o tempo de rede.
