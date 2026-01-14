// db.js - Atualizado com os itens dos prints
let db = JSON.parse(localStorage.getItem('lu_sistema_final')) || {
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
        { nome: "Galinha gurizada", tipo: "carne", status: false },
        { nome: "Calabresa acebolada", tipo: "carne", status: false },
        { nome: "Fígado acebolado", tipo: "carne", status: false },
        { nome: "Isca de fígado", tipo: "carne", status: false },
        { nome: "Cocha sobre cocha", tipo: "carne", status: false },
        { nome: "Bisteca de frango", tipo: "carne", status: false },
        { nome: "Boi guizado", tipo: "carne", status: true },
        { nome: "Macaxeira", tipo: "acomp", status: true },
        { nome: "Batata doce", tipo: "acomp", status: true },
        { nome: "Arroz refogado", tipo: "acomp", status: true },
        { nome: "Macarrão ninho", tipo: "acomp", status: false },
        { nome: "Macarrão parafuso", tipo: "acomp", status: false }
    ],
    extras: [
        { nome: "Suco de Acerola", preco: 5.00, status: true },
        { nome: "Suco de maracuja", preco: 5.00, status: true },
        { nome: "Suco de Goiaba", preco: 5.00, status: true },
        { nome: "Suco de manga", preco: 5.00, status: true },
        { nome: "Suco de cajú", preco: 5.00, status: true },
        { nome: "Suco de abacaxi com or", preco: 5.00, status: true },
        { nome: "Coca cola 0", preco: 5.50, status: true },
        { nome: "Coca cola", preco: 5.50, status: true }
    ]
};

db.config.tel = "558386379041"; 
const saveToDisk = () => localStorage.setItem('lu_sistema_final', JSON.stringify(db));
const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
