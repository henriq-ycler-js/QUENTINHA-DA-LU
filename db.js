// ===============================
// DB PRINCIPAL — QUENTINHA DA LU
// ===============================

const FORCE_VERSION = "20260116";

const versaoSalva = localStorage.getItem("lu_version");

if (versaoSalva !== FORCE_VERSION) {
    localStorage.clear();
    localStorage.setItem("lu_version", FORCE_VERSION);
}
function gerarHash(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

// 📦 BANCO PADRÃO
const dbPadrao = {
    config: {
        pedidoAtual: 1,
        lucroTotal: 0,
        tel: "558386379041"
    },

    tamanhos: [
        { id: 1, nome: "Baby", preco: 12.00, carnes: 1, status: true, img: "" },
        { id: 2, nome: "Pequena", preco: 15.00, carnes: 1, status: true, img: "" },
        { id: 3, nome: "Média", preco: 18.00, carnes: 1, status: true, img: "" },
        { id: 4, nome: "Grande", preco: 20.00, carnes: 2, status: true, img: "" },
        { id: 5, nome: "GG", preco: 25.00, carnes: 3, status: true, img: "" }
    ],

    cardapio: [
       { nome: "Feijão carioca", tipo: "acomp", status: true },
       { nome: "Arroz refolgado", tipo: "acomp", status: true },
       { nome: "Macarrão espaguete", tipo: "acomp", status: true },
       { nome: "Cuscuz temperado", tipo: "acomp", status: true },
       { nome: "Farofa caseira", tipo: "acomp", status: true },
       { nome: "Batata doce", tipo: "acomp", status: true },
       { nome: "Purê de batatinha", tipo: "acomp", status: true },
       { nome: "Salada de alface", tipo: "acomp", status: true },
       { nome: "Cenoura e beterraba", tipo: "acomp", status: true },
       { nome: "Peixe frito", tipo: "carne", status: true },
       { nome: "Boi guizado", tipo: "carne", status: true },
       { nome: "Calabreza acebolada", tipo: "carne", status: true },
    ],

    extras: [
        { nome: "Suco de Acerola", preco: 5.00, status: true },
        { nome: "Suco de Maracujá", preco: 5.00, status: true },
        { nome: "Suco de Goiaba", preco: 5.00, status: false },
        { nome: "Suco de Manga", preco: 5.00, status: true },
        { nome: "Suco de Caju", preco: 5.00, status: false },
        { nome: "Suco de Abacaxi com Hortelã", preco: 5.00, status: false },
        { nome: "Coca-Cola 0", preco: 5.50, status: true },
        { nome: "Coca-Cola", preco: 5.50, status: true }
    ]
};

// 🔑 HASH AUTOMÁTICO
const HASH_ATUAL = gerarHash({
    tamanhos: dbPadrao.tamanhos,
    cardapio: dbPadrao.cardapio,
    extras: dbPadrao.extras
});

// 🔁 CARGA INTELIGENTE
let dbLocal = JSON.parse(localStorage.getItem("lu_sistema_final"));
let db;

if (!dbLocal || dbLocal.hash !== HASH_ATUAL) {
    db = {
        ...dbPadrao,
        hash: HASH_ATUAL
    };
    localStorage.setItem("lu_sistema_final", JSON.stringify(db));
} else {
    db = dbLocal;
}

// 💾 SALVAR
function saveToDisk() {
    localStorage.setItem("lu_sistema_final", JSON.stringify(db));
}

// 💰 FORMATAR MOEDA
function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


