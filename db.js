

function gerarHash(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

// 📦 BANCO PADRÃO (EDITA AQUI QUANDO QUISER)
const dbPadrao = {
    config: { 
        pedidoAtual: 1, 
        lucroTotal: 0, 
        tel: "558386379041" 
    },

    tamanhos: [
        { id: 1, nome: "Baby", preco: 12.00, carnes: 1, status: true, img: "" },
        { id: 2, nome: "Pequena", preco: 15.00, carnes: 1, status: true, img: "" },
        { id: 3, nome: "Média", preco: 18.00, carnes: 2, status: true, img: "" },
        { id: 4, nome: "Grande", preco: 20.00, carnes: 3, status: true, img: "" }
    ],

    cardapio: [
        { nome: "Panqueca de frango", tipo: "carne", status: false },
        { nome: "Peixe frito", tipo: "carne", status: true },
        { nome: "Carne de sol", tipo: "carne", status: false },
        { nome: "Galinha guisada", tipo: "carne", status: false },
        { nome: "Calabresa acebolada", tipo: "carne", status: false },
        { nome: "Fígado acebolado", tipo: "carne", status: false },
        { nome: "Isca de fígado", tipo: "carne", status: false },
        { nome: "Cocha sobre cocha", tipo: "carne", status: false },
        { nome: "Bisteca de frango", tipo: "carne", status: false },
        { nome: "Boi guisado", tipo: "carne", status: true },

        { nome: "Macaxeira", tipo: "acomp", status: true },
        { nome: "Batata doce", tipo: "acomp", status: true },
        { nome: "Arroz refogado", tipo: "acomp", status: true },
        { nome: "Macarrão ninho", tipo: "acomp", status: false },
        { nome: "Macarrão parafuso", tipo: "acomp", status: false }
    ],

    extras: [
        { nome: "Suco de Acerola", preco: 5.00, status: true },
        { nome: "Suco de Maracujá", preco: 5.00, status: true },
        { nome: "Suco de Goiaba", preco: 5.00, status: true },
        { nome: "Suco de Manga", preco: 5.00, status: true },
        { nome: "Suco de Caju", preco: 5.00, status: true },
        { nome: "Suco de Abacaxi com Hortelã", preco: 5.00, status: true },
        { nome: "Coca-Cola 0", preco: 5.50, status: true },
        { nome: "Coca-Cola", preco: 5.50, status: true }
    ]
};

// 🔑 HASH ATUAL (SE MUDAR QUALQUER COISA ACIMA, ELE MUDA)
const HASH_ATUAL = gerarHash({
    tamanhos: dbPadrao.tamanhos,
    cardapio: dbPadrao.cardapio,
    extras: dbPadrao.extras
});

// 🔁 CARREGAMENTO INTELIGENTE
let dbLocal = JSON.parse(localStorage.getItem('lu_sistema_final'));
let db;

if (!dbLocal || dbLocal.hash !== HASH_ATUAL) {
    db = {
        ...dbPadrao,
        hash: HASH_ATUAL
    };
    localStorage.setItem('lu_sistema_final', JSON.stringify(db));
} else {
    db = dbLocal;
}

// 💾 SALVAR
const saveToDisk = () => {
    localStorage.setItem('lu_sistema_final', JSON.stringify(db));
};

// 💰 FORMATAR MOEDA
const moeda = (v) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


