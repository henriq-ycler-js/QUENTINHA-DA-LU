// admin.js - Ajustado para melhor visualização dos inputs
let tempDb = null;

function render() {
    const app = document.getElementById('app');
    if (!tempDb) tempDb = JSON.parse(JSON.stringify(db));

    app.innerHTML = `
        <div class="grid grid-cols-2 gap-2 mb-6">
            <div class="card p-3 text-center">
                <p class="text-[8px] uppercase text-zinc-500">Faturamento</p>
                <p class="text-green-500 font-black">${moeda(tempDb.config.lucroTotal)}</p>
                <button onclick="tempDb.config.lucroTotal=0;render()" class="text-[8px] underline">Zerar</button>
            </div>
            <div class="card p-3 text-center">
                <p class="text-[8px] uppercase text-zinc-500">Pedido Nº</p>
                <p class="font-black"># ${tempDb.config.pedidoAtual}</p>
                <button onclick="tempDb.config.pedidoAtual=1;render()" class="text-[8px] underline">Resetar</button>
            </div>
        </div>

        <h3 class="secao-titulo">Tamanhos e Fotos</h3>
        ${tempDb.tamanhos.map((t, idx) => `
            <div class="card p-2 mb-2 flex items-center gap-2">
                <label class="w-10 h-10 bg-zinc-800 rounded overflow-hidden shrink-0 cursor-pointer flex items-center justify-center border border-zinc-700">
                    ${t.img ? `<img src="${t.img}" class="w-full h-full object-cover">` : `<span class="text-[10px]">FOTO</span>`}
                    <input type="file" onchange="subirFoto(event, ${idx})" class="hidden">
                </label>
                <input type="text" value="${t.nome}" oninput="tempDb.tamanhos[${idx}].nome=this.value" class="!p-1 !text-xs flex-1" placeholder="Nome">
                <input type="number" value="${t.preco}" oninput="tempDb.tamanhos[${idx}].preco=parseFloat(this.value)" class="!w-14 !p-1 !text-xs !mb-0" placeholder="R$">
                <input type="number" value="${t.carnes}" oninput="tempDb.tamanhos[${idx}].carnes=parseInt(this.value)" class="!w-10 !p-1 !text-xs !mb-0 text-center" title="Qtd Carnes">
                <button onclick="tempDb.tamanhos[${idx}].status=!tempDb.tamanhos[${idx}].status;render()" class="p-1 px-2 rounded text-[8px] font-bold ${t.status?'bg-white text-black':'bg-zinc-800 text-zinc-600'}">${t.status?'VAI':'OFF'}</button>
                <button onclick="tempDb.tamanhos.splice(${idx},1);render()" class="text-red-600 px-1">✕</button>
            </div>`).join('')}
        <button onclick="tempDb.tamanhos.push({id:Date.now(),nome:'',preco:0,carnes:1,status:true,img:''});render()" class="w-full p-2 border border-dashed border-zinc-700 text-[10px] text-zinc-500 mb-6">+ NOVO TAMANHO</button>

        <h3 class="secao-titulo">Carnes e Acompanhamentos</h3>
        ${tempDb.cardapio.map((i, idx) => `
            <div class="card p-2 mb-1 flex items-center gap-2">
                <input type="text" value="${i.nome}" oninput="tempDb.cardapio[${idx}].nome=this.value" class="!p-1 !text-xs flex-1">
                <select onchange="tempDb.cardapio[${idx}].tipo=this.value" class="!w-24 !p-1 !text-[8px] !mb-0">
                    <option value="carne" ${i.tipo=='carne'?'selected':''}>CARNE</option>
                    <option value="acomp" ${i.tipo=='acomp'?'selected':''}>ACOMPANHAMENTO</option>
                </select>
                <button onclick="tempDb.cardapio[${idx}].status=!tempDb.cardapio[${idx}].status;render()" class="p-1 px-2 rounded text-[8px] font-bold ${i.status?'bg-white text-black':'bg-zinc-800 text-zinc-600'}">${i.status?'VAI':'OFF'}</button>
                <button onclick="tempDb.cardapio.splice(${idx},1);render()" class="text-red-600 px-1">✕</button>
            </div>`).join('')}
        <button onclick="tempDb.cardapio.push({nome:'',tipo:'carne',status:true});render()" class="w-full p-2 border border-dashed border-zinc-700 text-[10px] text-zinc-500 mb-6">+ NOVO ITEM</button>

        <h3 class="secao-titulo">Bebidas / Sucos</h3>
        ${tempDb.extras.map((e, idx) => `
            <div class="card p-2 mb-1 flex items-center gap-2">
                <input type="text" value="${e.nome}" oninput="tempDb.extras[${idx}].nome=this.value" class="!p-1 !text-xs flex-1">
                <input type="number" value="${e.preco}" oninput="tempDb.extras[${idx}].preco=parseFloat(this.value)" class="!w-14 !p-1 !text-xs !mb-0">
                <button onclick="tempDb.extras[${idx}].status=!tempDb.extras[${idx}].status;render()" class="p-1 px-2 rounded text-[8px] font-bold ${e.status?'bg-white text-black':'bg-zinc-800 text-zinc-600'}">${e.status?'VAI':'OFF'}</button>
                <button onclick="tempDb.extras.splice(${idx},1);render()" class="text-red-600 px-1">✕</button>
            </div>`).join('')}
        <button onclick="tempDb.extras.push({nome:'',preco:0,status:true});render()" class="w-full p-2 border border-dashed border-zinc-700 text-[10px] text-zinc-500">+ NOVA BEBIDA</button>

        <div class="sticky-footer"><button onclick="salvarTudo()" class="btn-yellow">💾 SALVAR TUDO</button></div>
    `;
}

window.subirFoto = (e, idx) => {
    const r = new FileReader();
    r.onload = () => { tempDb.tamanhos[idx].img = r.result; render(); };
    if(e.target.files[0]) r.readAsDataURL(e.target.files[0]);
};

window.salvarTudo = () => { 
    db = JSON.parse(JSON.stringify(tempDb)); 
    saveToDisk(); 
    alert("Configurações salvas com sucesso!"); 
    window.location.href = 'index.html'; 
};

render();
