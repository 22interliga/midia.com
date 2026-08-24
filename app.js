const navItems = [
  ['dashboard','▦','Dashboard','Visão geral da operação'],
  ['pedidos','◫','Pedidos','Coletas e entregas cadastradas'],
  ['despacho','⇄','Despacho','Distribuição de entregas'],
  ['rotas','⌁','Roteirização','Rotas e sequência de paradas'],
  ['motoristas','◉','Motoristas','Entregadores e disponibilidade'],
  ['veiculos','◆','Veículos','Moto e Inter Car'],
  ['clientes','▣','Clientes','Empresas contratantes'],
  ['precos','R$','Precificação','Tarifas e faixas de km'],
  ['financeiro','$','Financeiro','Faturamento, repasses e margem'],
  ['relatorios','▤','Relatórios','KPIs e desempenho operacional']
];

const demo = {
  orders:[
    {id:'LM-1048',cliente:'Mercado Bahia',destinatario:'Carlos Silva',coleta:'Candeias',entrega:'Madre de Deus',veiculo:'Moto',status:'Em rota',prioridade:'Alta',valor:24.80,volumes:1},
    {id:'LM-1047',cliente:'Farmácia União',destinatario:'Ana Souza',coleta:'São Francisco do Conde',entrega:'Candeias',veiculo:'Inter Car',status:'Aguardando',prioridade:'Normal',valor:31.20,volumes:3},
    {id:'LM-1046',cliente:'Loja Central',destinatario:'João Santos',coleta:'Simões Filho',entrega:'Candeias',veiculo:'Moto',status:'Entregue',prioridade:'Normal',valor:18.50,volumes:1},
    {id:'LM-1045',cliente:'Auto Peças BR',destinatario:'Marcos Lima',coleta:'Candeias',entrega:'São Francisco do Conde',veiculo:'Inter Car',status:'Ocorrência',prioridade:'Urgente',valor:44.90,volumes:4},
    {id:'LM-1044',cliente:'Mercado Bahia',destinatario:'Paula Reis',coleta:'Madre de Deus',entrega:'Candeias',veiculo:'Moto',status:'Entregue',prioridade:'Normal',valor:21.60,volumes:1}
  ],
  drivers:[
    {nome:'Rafael Santos',veiculo:'Moto',placa:'ABC-1D23',status:'Online',entregas:14,km:68},
    {nome:'Diego Lima',veiculo:'Inter Car',placa:'QWE-7F90',status:'Em rota',entregas:11,km:91},
    {nome:'Lucas Rocha',veiculo:'Moto',placa:'JKL-3A77',status:'Online',entregas:17,km:74},
    {nome:'André Costa',veiculo:'Inter Car',placa:'RTY-5H12',status:'Offline',entregas:8,km:55}
  ]
};

const state = JSON.parse(localStorage.getItem('interliga-lastmile') || 'null') || structuredClone(demo);
const $ = s => document.querySelector(s);
const money = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const statusBadge = s => {
  const cls = s==='Entregue'||s==='Online'?'green':s==='Em rota'?'blue':s==='Aguardando'?'orange':s==='Ocorrência'?'red':'';
  return `<span class="badge ${cls}">${s}</span>`;
};
function save(){localStorage.setItem('interliga-lastmile',JSON.stringify(state));}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}

const nav = $('#nav');
nav.innerHTML = navItems.map(([id,icon,label])=>`<button class="nav-btn" data-page="${id}"><span>${icon}</span>${label}</button>`).join('');

function kpi(label,value,delta,cls='good'){return `<div class="card kpi"><div class="label">${label}</div><div class="value">${value}</div><div class="delta ${cls}">${delta}</div></div>`}
function dashboard(){
  const delivered=state.orders.filter(o=>o.status==='Entregue').length;
  const inRoute=state.orders.filter(o=>o.status==='Em rota').length;
  const pending=state.orders.filter(o=>o.status==='Aguardando').length;
  return `<div class="grid kpis">
    ${kpi('Entregas hoje',state.orders.length,'↑ operação ativa')}
    ${kpi('Entregues',delivered,'SLA 94,7%')}
    ${kpi('Em rota',inRoute,'Acompanhamento em tempo real','')}
    ${kpi('Pendentes',pending,'Requer despacho','warn')}
  </div>
  <div class="grid section-grid">
    <div class="card"><h3>Mapa operacional</h3><div class="map-mock">
      <i class="pin" style="left:18%;top:27%"></i><i class="pin blue" style="left:45%;top:62%"></i><i class="pin orange" style="left:68%;top:24%"></i><i class="pin" style="left:80%;top:70%"></i>
    </div><div class="legend"><span><i class="dot"></i>Motoristas</span><span><i class="dot blue"></i>Em rota</span><span><i class="dot orange"></i>Pendências</span></div></div>
    <div class="card"><h3>Operação do dia</h3><div class="mini-list">
      <div class="mini-item"><div><strong>SLA</strong><span>Meta 95%</span></div><b>94,7%</b></div>
      <div class="mini-item"><div><strong>Km planejado</strong><span>Rotas geradas</span></div><b>312 km</b></div>
      <div class="mini-item"><div><strong>Km realizado</strong><span>GPS acumulado</span></div><b>298 km</b></div>
      <div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span>Progresso operacional</span><b>78%</b></div><div class="progress"><i style="width:78%"></i></div></div>
    </div></div>
  </div>`;
}
function orders(){return `<div class="card"><div class="toolbar"><input class="search" id="orderSearch" placeholder="Buscar pedido, cliente ou destinatário"><div class="filters"><button class="ghost-btn">Todos</button><button class="ghost-btn">Em rota</button><button class="ghost-btn">Entregues</button></div></div>${ordersTable(state.orders)}</div>`}
function ordersTable(rows){return `<div class="table-wrap"><table class="table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Destinatário</th><th>Trecho</th><th>Veículo</th><th>Status</th><th>Valor</th></tr></thead><tbody>${rows.map(o=>`<tr><td><strong>${o.id}</strong></td><td>${o.cliente}</td><td>${o.destinatario}</td><td>${o.coleta} → ${o.entrega}</td><td>${o.veiculo}</td><td>${statusBadge(o.status)}</td><td>${money(o.valor)}</td></tr>`).join('')}</tbody></table></div>`}
function dispatch(){const pending=state.orders.filter(o=>o.status==='Aguardando'||o.status==='Ocorrência');return `<div class="grid section-grid"><div class="card"><h3>Entregas disponíveis</h3>${pending.length?ordersTable(pending):'<div class="empty">Nenhuma entrega aguardando despacho.</div>'}</div><div class="card"><h3>Motoristas disponíveis</h3><div class="mini-list">${state.drivers.filter(d=>d.status!=='Offline').map(d=>`<div class="mini-item"><div><strong>${d.nome}</strong><span>${d.veiculo} • ${d.placa}</span></div>${statusBadge(d.status)}</div>`).join('')}</div><button class="primary-btn" style="width:100%;margin-top:14px" onclick="autoDispatch()">Despachar automaticamente</button></div></div>`}
function routes(){return `<div class="grid section-grid"><div class="card"><h3>Rota LM-R023 • Diego Lima</h3>${['Base Candeias','Farmácia União • Coleta','Ana Souza • Entrega','Mercado Bahia • Entrega','Base Candeias'].map((p,i)=>`<div class="route-row"><div class="route-index">${i+1}</div><div><strong>${p}</strong><div style="font-size:12px;color:var(--muted)">${i===0?'08:00':`${8+i}:1${i} • ${5+i*3} km`}</div></div><span class="badge ${i<2?'green':'blue'}">${i<2?'Concluído':'Próximo'}</span></div>`).join('')}</div><div class="card"><h3>Resumo da rota</h3><div class="mini-list"><div class="mini-item"><span>Distância</span><b>72 km</b></div><div class="mini-item"><span>Duração prevista</span><b>4h 15min</b></div><div class="mini-item"><span>Paradas</span><b>5</b></div><div class="mini-item"><span>Capacidade</span><b>68%</b></div><div class="mini-item"><span>Custo estimado</span><b>${money(138.40)}</b></div></div></div></div>`}
function drivers(){return `<div class="card">${simpleTable(['Motorista','Veículo','Placa','Status','Entregas','Km'],state.drivers.map(d=>[d.nome,d.veiculo,d.placa,statusBadge(d.status),d.entregas,d.km+' km']))}</div>`}
function vehicles(){const rows=[['Moto','3 ativos','Até 20 kg','Entregas rápidas'],['Inter Car','2 ativos','Até 250 kg','Volumes e múltiplas paradas']];return `<div class="grid kpis">${kpi('Motos','3','2 online')}${kpi('Inter Car','2','1 em rota')}${kpi('Disponíveis','3','Agora')}${kpi('Em manutenção','0','Tudo operacional')}</div><div class="card" style="margin-top:18px">${simpleTable(['Categoria','Frota','Capacidade','Uso'],rows)}</div>`}
function clients(){const rows=[['Mercado Bahia','18 entregas','Ativo',money(486.20)],['Farmácia União','12 entregas','Ativo',money(319.70)],['Loja Central','9 entregas','Ativo',money(226.10)],['Auto Peças BR','6 entregas','Ativo',money(284.90)]];return `<div class="card">${simpleTable(['Cliente','Volume hoje','Status','Faturamento'],rows)}</div>`}
function prices(){return `<div class="grid section-grid"><div class="card"><h3>Moto</h3><div class="mini-list"><div class="mini-item"><span>Taxa inicial</span><b>${money(8)}</b></div><div class="mini-item"><span>Valor por km</span><b>${money(2.4)}</b></div><div class="mini-item"><span>Mínimo</span><b>${money(12)}</b></div><div class="mini-item"><span>Parada adicional</span><b>${money(4)}</b></div></div></div><div class="card"><h3>Inter Car</h3><div class="mini-list"><div class="mini-item"><span>Taxa inicial</span><b>${money(9.99)}</b></div><div class="mini-item"><span>Valor por km</span><b>${money(2.4)}</b></div><div class="mini-item"><span>Mínimo</span><b>${money(15)}</b></div><div class="mini-item"><span>Parada adicional</span><b>${money(6)}</b></div></div></div></div><div class="card" style="margin-top:18px"><h3>Faixas de km</h3>${simpleTable(['Faixa','Regra','Valor'],[['0–5 km','Fixo',money(15)],['5–10 km','Fixo',money(22)],['10–20 km','Fixo',money(35)],['20–30 km','Fixo',money(48)],['Acima de 30 km','Por km',money(2.4)+' / km']])}</div>`}
function finance(){const receita=state.orders.reduce((a,o)=>a+o.valor,0),repasse=receita*.68,margem=receita-repasse;return `<div class="grid kpis">${kpi('Faturamento',money(receita),'Pedidos cadastrados')}${kpi('Repasses',money(repasse),'68% da operação','')}${kpi('Margem',money(margem),'32% estimada')}${kpi('A receber',money(receita*.42),'Clientes faturados','warn')}</div><div class="card" style="margin-top:18px"><h3>Resumo por cliente</h3>${simpleTable(['Cliente','Entregas','Cobrado','Repasse','Margem'],[['Mercado Bahia','18',money(486.2),money(330.6),money(155.6)],['Farmácia União','12',money(319.7),money(217.4),money(102.3)],['Loja Central','9',money(226.1),money(153.7),money(72.4)]])}</div>`}
function reports(){return `<div class="grid kpis">${kpi('SLA','94,7%','Meta 95%','warn')}${kpi('Sucesso','96,2%','↑ 1,8%')}${kpi('Custo/entrega',money(16.42),'↓ 4,1%')}${kpi('Km/entrega','7,8 km','↓ 0,6 km')}</div><div class="grid section-grid"><div class="card"><h3>Indicadores</h3>${simpleTable(['KPI','Atual','Meta'],[['Entregas no prazo','94,7%','95%'],['Taxa de sucesso','96,2%','97%'],['Km por entrega','7,8','≤ 8,0'],['Tempo médio','41 min','≤ 45 min']])}</div><div class="card"><h3>Exportações</h3><div class="mini-list"><button class="ghost-btn" onclick="toast('Relatório CSV preparado (demo)')">Exportar CSV</button><button class="ghost-btn" onclick="toast('Relatório XLSX preparado (demo)')">Exportar XLSX</button><button class="ghost-btn" onclick="toast('Relatório PDF preparado (demo)')">Exportar PDF</button></div></div></div>`}
function simpleTable(headers,rows){return `<div class="table-wrap"><table class="table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}

const pages={dashboard, pedidos:orders, despacho:dispatch, rotas:routes, motoristas:drivers, veiculos:vehicles, clientes, precos:prices, financeiro:finance, relatorios:reports};
function render(page='dashboard'){
  const item=navItems.find(i=>i[0]===page)||navItems[0];
  $('#pageTitle').textContent=item[2];$('#pageSubtitle').textContent=item[3];
  $('#content').innerHTML=pages[item[0]]();
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===item[0]));
  location.hash=item[0];
  const search=$('#orderSearch'); if(search) search.addEventListener('input',e=>{const q=e.target.value.toLowerCase();const filtered=state.orders.filter(o=>Object.values(o).join(' ').toLowerCase().includes(q));search.closest('.card').querySelector('.table-wrap').outerHTML=ordersTable(filtered)});
}
function autoDispatch(){const order=state.orders.find(o=>o.status==='Aguardando');if(order){order.status='Em rota';save();toast(`${order.id} despachado automaticamente`);render('despacho')}else toast('Sem pedidos aguardando despacho')}
window.autoDispatch=autoDispatch;window.toast=toast;

nav.addEventListener('click',e=>{const b=e.target.closest('.nav-btn');if(!b)return;render(b.dataset.page);closeMenu()});
$('#newOrderBtn').addEventListener('click',()=>$('#orderDialog').showModal());
$('#closeDialogBtn').addEventListener('click',()=>$('#orderDialog').close());
$('#cancelDialogBtn').addEventListener('click',()=>$('#orderDialog').close());
$('#orderForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const id='LM-'+(1049+state.orders.length);state.orders.unshift({id,cliente:f.get('cliente'),destinatario:f.get('destinatario'),telefone:f.get('telefone'),coleta:f.get('coleta'),entrega:f.get('entrega'),veiculo:f.get('veiculo'),status:'Aguardando',prioridade:f.get('prioridade'),valor:f.get('veiculo')==='Moto'?18.5:27.9,volumes:Number(f.get('volumes')||1)});save();e.currentTarget.reset();$('#orderDialog').close();toast('Pedido cadastrado com sucesso');render('pedidos')});
$('#seedBtn').addEventListener('click',()=>{localStorage.removeItem('interliga-lastmile');location.reload()});
function closeMenu(){$('#sidebar').classList.remove('open');$('#overlay').classList.remove('show')}
$('#menuBtn').addEventListener('click',()=>{$('#sidebar').classList.toggle('open');$('#overlay').classList.toggle('show')});$('#overlay').addEventListener('click',closeMenu);
window.addEventListener('hashchange',()=>render(location.hash.slice(1)||'dashboard'));
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
render(location.hash.slice(1)||'dashboard');
