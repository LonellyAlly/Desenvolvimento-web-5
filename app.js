// =======================================================
// PARTE 1 - Manipulação e Validação de Dados
// =======================================================
const pedidos = [
    { cliente: "Bia", valor: 120.00, status: "pago" },
    { cliente: "Carlos", valor: -15.00, status: "pago" }, // Inválido (valor < 0)
    { cliente: "", valor: 50.00, status: "pendente" },    // Inválido (nome vazio)
    { cliente: "Ana", valor: 200.50, status: "pendente" },
    { cliente: "João", valor: 85.00, status: "pago" }
];

// Valida e filtra apenas os "pagos"
const pedidosValidosPagos = pedidos.filter(pedido => 
    pedido.cliente.trim() !== "" && 
    pedido.valor > 0 && 
    pedido.status === "pago"
);

// Calcula o total faturado
const totalFaturado = pedidosValidosPagos.reduce((acumulador, pedido) => acumulador + pedido.valor, 0);

// Gera os textos no formato solicitado
const textosPedidos = pedidosValidosPagos.map(pedido => `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`);

// Renderiza no DOM
const ulPedidos = document.querySelector("#lista-pedidos");
textosPedidos.forEach(texto => {
    const li = document.createElement("li");
    li.textContent = texto; // Usando textContent para segurança contra XSS
    ulPedidos.append(li);
});
document.querySelector("#total-faturado").textContent = `R$ ${totalFaturado.toFixed(2)}`;


// =======================================================
// PARTE 2 - Mini Projeto: Buscador de CEP
// =======================================================
const formCep = document.querySelector("#form-cep");
const inputCep = document.querySelector("#input-cep");
const btnCep = document.querySelector("#btn-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCepUl = document.querySelector("#historico-cep");

const historicoPesquisas = []; // Array para o Bônus de histórico

formCep.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Limpa e validação
    const cepValue = inputCep.value.trim().replace(/\D/g, ""); // Remove não-números
    if (!/^\d{8}$/.test(cepValue)) {
        statusCep.textContent = "⚠️ Formato inválido! Digite exatamente 8 números.";
        statusCep.className = "status erro";
        resultadoCep.replaceChildren(); // Limpa resultados anteriores
        return;
    }

    // Estado: Carregando
    btnCep.disabled = true;
    statusCep.textContent = "⏳ Buscando...";
    statusCep.className = "status";
    resultadoCep.replaceChildren(); // Limpa resultado

    try {
        // Dica bônus: AbortSignal para Timeout de 5s
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`, {
            signal: AbortSignal.timeout(5000)
        });

        // Tratamento de erro HTTP
        if (!response.ok) throw new Error("Erro na requisição. Verifique sua conexão.");

        const data = await response.json();

        // Estado: Vazio / Não Encontrado
        if (data.erro) {
            statusCep.textContent = "❌ CEP não encontrado.";
            statusCep.className = "status erro";
            return; // Encerra fluxo
        }

        // Estado: Sucesso
        statusCep.textContent = ""; // Limpa a mensagem de status
        
        // Renderiza elementos dinamicamente (Proteção XSS)
        const campos = [
            { termo: "Rua", def: data.logradouro },
            { termo: "Bairro", def: data.bairro },
            { termo: "Cidade", def: data.localidade },
            { termo: "UF", def: data.uf }
        ];

        campos.forEach(campo => {
            if (campo.def) {
                const dt = document.createElement("dt");
                dt.textContent = `${campo.termo}:`;
                const dd = document.createElement("dd");
                dd.textContent = campo.def;
                resultadoCep.append(dt, dd);
            }
        });

        // Salva histórico
        historicoPesquisas.push(data.cep);
        renderizarHistorico();

    } catch (error) {
        // Estado: Erro (Rede ou Timeout)
        statusCep.textContent = error.name === "TimeoutError" 
            ? "⏱️ O servidor demorou muito para responder." 
            : `❌ Erro de rede: ${error.message}`;
        statusCep.className = "status erro";
    } finally {
        btnCep.disabled = false;
        inputCep.value = "";
    }
});

function renderizarHistorico() {
    historicoCepUl.replaceChildren();
    historicoPesquisas.forEach(cepPesquisado => {
        const li = document.createElement("li");
        li.textContent = cepPesquisado;
        historicoCepUl.append(li);
    });
}


// =======================================================
// PARTE 3 - Tarefa de Casa: Desafio Mini Pokédex
// =======================================================
const formPokedex = document.querySelector("#form-pokedex");
const inputPokemon = document.querySelector("#input-pokemon");
const btnPokemon = document.querySelector("#btn-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

formPokedex.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pokemonName = inputPokemon.value.trim().toLowerCase();
    
    if (!pokemonName) {
        statusPokemon.textContent = "⚠️ Digite um nome de Pokémon válido.";
        statusPokemon.className = "status erro";
        resultadoPokemon.replaceChildren();
        return;
    }

    // Estado: Carregando
    btnPokemon.disabled = true;
    statusPokemon.textContent = "⏳ Procurando Pokémon...";
    statusPokemon.className = "status";
    resultadoPokemon.replaceChildren();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        
        // Tratamento do Erro 404
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Pokémon não encontrado.");
            }
            throw new Error(`Erro na rede (Status: ${response.status})`);
        }

        const data = await response.json();

        // Estado: Sucesso
        statusPokemon.textContent = "";

        // Criando os elementos dinamicamente
        const img = document.createElement("img");
        img.src = data.sprites.front_default;
        img.alt = `Imagem do ${data.name}`;

        const h3 = document.createElement("h3");
        h3.textContent = data.name.toUpperCase();

        const ulTipos = document.createElement("ul");
        data.types.forEach(tipoInfo => {
            const li = document.createElement("li");
            li.textContent = tipoInfo.type.name;
            ulTipos.append(li);
        });

        // Adiciona tudo na tela
        resultadoPokemon.append(img, h3, ulTipos);

    } catch (error) {
        // Estado: Erro / Não encontrado
        statusPokemon.textContent = `❌ ${error.message}`;
        statusPokemon.className = "status erro";
    } finally {
        btnPokemon.disabled = false;
        inputPokemon.value = "";
    }
});
