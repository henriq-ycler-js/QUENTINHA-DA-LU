let tempDb = null;
function render() {
    const app = document.getElementById('app');
    if (!tempDb) tempDb = JSON.parse(JSON.stringify(db));
    app.innerHTML = `
        <h2 style="text-align:center; font-size:14px;">GERENCIAR CARDÁPIO</h2>
        
        <div class="card-adm">
            <span style="font-size:10px;">ZAP:</span>
            <input type="text" value="${tempDb.config.tel}" oninput="tempDb.config.tel=this.value" class="input-adm" style="flex:1">
        </div>

        <p style="font-size:10px; color:var(--primary); font-weight:bold; margin-top:20px;">MARMITAS</p>
        ${tempDb.tamanhos.map((t, idx) => `
            <div class="card-adm">
                <img src="${t.img}" style="width:30px; height:30px; border-radius:4px; object-fit:cover;">
                <input type="text" value="${t.nome}" oninput="tempDb.tamanhos[${idx}].nome=this.value" class="input-adm" style="width:100px">
                <input type="number" value="${t.preco}" oninput="tempDb.tamanhos[${idx}].preco=parseFloat(this.value)" class="input-adm" style="width:60px">
                <button onclick="tempDb.tamanhos.splice(${idx},1);render()" style="color:red; background:none; border:none; margin-left:auto;">✕</button>
            </div>
        `).join('')}

        <div class="sticky-footer">
            <button onclick="salvarTudo()" class="btn-yellow">💾 SALVAR ALTERAÇÕES</button>
        </div>
    `;
}
window.salvarTudo = () => { db = JSON.parse(JSON.stringify(tempDb)); saveToDisk(); alert("Salvo!"); window.location.href = 'index.html'; };
render();
