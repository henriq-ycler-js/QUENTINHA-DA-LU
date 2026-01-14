// Banco de Dados - Versão Final
let db = JSON.parse(localStorage.getItem('lu_sistema_final')) || {
    config: { 
        pedidoAtual: 1, 
        lucroTotal: 0, 
        tel: "558386379041" 
    },
    tamanhos: [],
    cardapio: [],
    extras: []
};

db.config.tel = "558386379041"; 

const saveToDisk = () => localStorage.setItem('lu_sistema_final', JSON.stringify(db));
const moeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });