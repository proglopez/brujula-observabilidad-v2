"use strict";
// Capa visual de la segunda versión. Reutiliza las señales y recorridos probados de v1.
const sourceCopy = {
  Zabbix: {short:"Eventos y recursos",detail:"Triggers, estado del host, CPU, memoria y disco.",color:"#c27921"},
  Dynatrace: {short:"Aplicación y experiencia",detail:"Problemas, respuesta, errores y experiencia cuando existe captura.",color:"#7960b6"}
};
// Catálogo ficticio explícito. Un evento de infraestructura no crea una serie APM.
const demoTelemetry={
  'Flujo Aurora':{host:'aurora-node-01',latencyFactor:1,errorFactor:1,apdex:.74},
  'Interfaz Boreal':{host:'boreal-api-02',latencyFactor:.62,errorFactor:.4,apdex:.74},
  'Acceso Duna':{host:'duna-auth-01',latencyFactor:.37,errorFactor:.4,apdex:null},
  'Proceso Cobalto':{host:null,latencyFactor:null,errorFactor:null,apdex:null},
  'Tareas Estela':{host:null,latencyFactor:null,errorFactor:null,apdex:null}
};
function telemetryFor(service,host='all'){
  const t=demoTelemetry[service]||{host:null,latencyFactor:null,errorFactor:null,apdex:null};
  return host==='all'||host===t.host?t:{...t,latencyFactor:null,errorFactor:null,apdex:null};
}
latencySeries=function(){
  return (state.service==='all'?services:[state.service]).map(service=>({service,t:telemetryFor(service,state.host)}))
    .filter(x=>x.t.latencyFactor!==null).map(({service,t},i)=>({name:service,color:palette[i],values:p95.map(n=>Math.round(n*t.latencyFactor))}));
};
function errorSeriesForSelection(){return latencySeries().map((s,i)=>({name:s.name,color:palette[i],values:errorLine.map(v=>v*telemetryFor(s.name,state.host).errorFactor)}));}

help.integrated = {
  title:"Una lectura visual sobre los mismos eventos",
  text:"Esta vista organiza las señales de Zabbix y Dynatrace por servicio para priorizar, contrastar y validar. Eventos conserva el registro completo; Indicadores y Registro de señales amplían la lectura.",
  items:["Las tarjetas de severidad abren las señales sin perder filtros ni posición.","El detalle de servicio reúne las dos fuentes y avisa que amplía los filtros de origen.","El mapa es una relación ilustrativa con claves explícitas; no descubre causa raíz automáticamente.","Los datos son ficticios. Los criterios de negocio y aceptación aún requieren definición."],
  url:"https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/canvas/"
};
help.resourceScope = {
  title:"Qué compara el ranking de recursos",
  text:"El ranking muestra métricas ficticias de Zabbix de los hosts de los servicios presentes en los eventos seleccionados. Herramienta, severidad, grupo y estado filtran eventos; servicio y host también acotan las métricas.",
  items:["Recurso cambia entre CPU, memoria y disco; Top permite mostrar tres o cinco hosts.","Si filtras sólo Dynatrace, puedes seguir viendo los recursos Zabbix de esos mismos servicios: es contexto entre fuentes, no eventos adicionales.","La cifra es un valor de ejemplo del recurso, no un promedio calculado a partir de la cantidad de alertas.","El plugin Zabbix permite consultar problemas, métricas y variables con una cuenta autorizada. Deben verificarse versión y permisos reales."],
  url:"https://grafana.com/docs/plugins/alexanderzobnin-zabbix-app/latest/"
};
help.apdex = {
  title:"APDEX dentro del contexto de Dynatrace",
  text:"Apdex es un índice entre 0 y 1 que resume la respuesta de las acciones observadas frente a umbrales definidos. No equivale al porcentaje de disponibilidad ni a que una operación de negocio finalice correctamente.",
  items:["Su fórmula general es (satisfechas + 0,5 × toleradas) / total de muestras.","Aquí se representa un valor ficticio recibido de la fuente; no se inventa una captura RUM ni se recalcula con las alertas.","Antes de usarlo como objetivo deben validarse acción/portal, umbrales, volumen de muestras, errores, ventana y cobertura.","Cuando no se representa experiencia en un servicio, se muestra Sin muestra. P95 y errores son métricas distintas.","Grafana puede presentar el índice existente. RUM, trazas y Session Replay dependen de Dynatrace y su instrumentación/licencia."],
  url:"https://www.apdex.org/wp-content/uploads/2020/09/ApdexTechnicalSpecificationV11_000.pdf"
};
help.business = {
  title:"Definiciones pendientes del tablero",
  text:"El prototipo permite revisar qué requiere atención, dónde se concentra y qué evidencia falta. Son preguntas de diseño operativas; no se presentan como un listado histórico aprobado.",
  items:["Confirmar las preguntas de negocio y el servicio/operación al que corresponde cada indicador.","Definir métrica, fórmula, unidad, fuente, cobertura, umbral, responsable y decisión que habilita.","Acordar criterio de éxito funcional, prueba y aceptación antes de declarar recuperación.","La disponibilidad técnica ilustrativa no se ofrece como SLA ni disponibilidad funcional certificada."]
};
help.integration.items = [
  "Zabbix: plugin de código abierto con API, consultas de problemas y métricas; validar versión compatible y acceso de lectura a grupos/hosts.",
  "Dynatrace: el conector oficial requiere Grafana Cloud o Enterprise con licencia activada, además de permisos del entorno. No se presume incluido en OSS local.",
  "Servicio, host y periodo deben tener claves compatibles. Las prioridades consolidadas necesitan una regla validada.",
  "Grafana presenta los datos existentes; no reconstruye RUM, trazas o resultado funcional ausentes."
];
help.severity.items.unshift("La prioridad común de esta demo es ilustrativa. Los niveles originales de cada herramienta deben conservarse y mapearse mediante una regla acordada.");

const scoreOrder = s => Object.keys(severityMeta).indexOf(s);
const worstOf = rows => rows.reduce((w,e)=>scoreOrder(e.severity)<scoreOrder(w)?e.severity:w,"low");
function contextResources(data){
  const selectedServices = new Set(data.map(e=>e.service));
  return resources.filter(r=>selectedServices.has(r.service)&&(state.service==="all"||r.service===state.service)&&(state.host==="all"||r.host===state.host))
    .sort((a,b)=>b[state.resource]-a[state.resource]).slice(0,state.top);
}
function spark(values,color){
  const top=Math.max(...values,1),bottom=Math.min(...values,0),width=180,height=40;
  const points=values.map((v,i)=>`${i*width/(values.length-1)},${height-4-(v-bottom)/(top-bottom||1)*(height-8)}`).join(" ");
  return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true"><polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function metricsFor(service){
  const t=telemetryFor(service,state.host),hasApp=t.latencyFactor!==null;
  return {hasApp,apdex:t.apdex,latency:hasApp?Math.round(3200*t.latencyFactor):null,errors:t.errorFactor!==null?4.8*t.errorFactor:null};
}
function compactNumber(n,d=0){return Number(n).toLocaleString("es-CO",{maximumFractionDigits:d,minimumFractionDigits:d});}
function renderIntegratedOverview(){
  const data=visibleEvents(), byService=[...new Set(data.map(e=>e.service))].map(name=>({name,rows:data.filter(e=>e.service===name)}));
  byService.sort((a,b)=>scoreOrder(worstOf(a.rows))-scoreOrder(worstOf(b.rows))||b.rows.length-a.rows.length);
  const urgent=data.filter(e=>["critical","high"].includes(e.severity));
  $("#overview-kpis").innerHTML=$("#kpis").innerHTML;
  $("#integrated-reading").innerHTML=`<div class="reading-symbol">◎</div><div><span class="section-number">LECTURA DE LA SELECCIÓN</span><h2>${data.length?`${data.length} señales en ${byService.length} servicios`:'Sin eventos para los filtros actuales'}</h2><p>${data.length?`${urgent.length} críticas o altas en ${new Set(urgent.map(e=>e.service)).size} servicios. La prioridad orienta la revisión; el host y la ventana reúnen la evidencia.`:'Una selección vacía no acredita disponibilidad. Revisa filtros y cobertura de las fuentes.'}</p></div><div class="reading-totals"><strong>${urgent.length}</strong><span>críticas o altas</span></div>`;
  $("#service-cards").innerHTML=byService.map(({name,rows})=>{
    const sev=worstOf(rows), z=rows.filter(e=>e.source==="Zabbix").length,d=rows.length-z;
    const hosts=[...new Set(rows.map(e=>e.host))];
    const main=rows[0],m=metricsFor(name);
    return `<a class="service-card" href="${serviceHref(name,state.host)}" style="--priority:${severityMeta[sev].color}"><div class="service-card-title"><h3>${esc(name)}</h3>${pill(sev)}</div><div class="source-tokens">${sourceTag("Zabbix")}<b>${z}</b>${sourceTag("Dynatrace")}<b>${d}</b></div><p>${esc(main.description)}</p><div class="service-card-foot"><span>${rows.length} ${rows.length===1?'señal':'señales'} · ${hosts.length} ${hosts.length===1?'host':'hosts'}</span><strong>Ver evidencia ↗</strong></div><small>${esc(hosts.join(' · '))}</small></a>`;
  }).join("")||'<p class="no-data">No hay servicios con eventos en esta selección.</p>';
  $("#integrated-sources").innerHTML=["Zabbix","Dynatrace"].map(source=>{
    const n=data.filter(e=>e.source===source).length,c=sourceCopy[source];
    return `<button type="button" class="source-summary ${state.source===source?'is-selected':''}" data-source-filter="${source}" aria-pressed="${state.source===source}"><div>${sourceTag(source)}<strong>${n}</strong></div><h3>${c.short}</h3><p>${c.detail}</p><span>${state.source===source?'Quitar filtro de esta herramienta':'Filtrar eventos de esta herramienta'} ↗</span></button>`;
  }).join('');
  const focus=byService[0], focusName=focus?.name, m=focus?metricsFor(focusName):null, r=contextResources(data), hostResources=resources.filter(x=>x.service===focusName&&(state.host==="all"||x.host===state.host));
  $("#focus-title").textContent=focus?`Contexto destacado · ${focusName}`:'Contexto entre fuentes';
  $("#focus-subtitle").textContent=focus?'Servicio con mayor prioridad en la selección; abre el detalle para contrastar las señales.':'Sin contexto seleccionable con estos filtros.';
  if(focus){
    const all=sameService(focusName).filter(e=>state.host==="all"||e.host===state.host),z=all.filter(e=>e.source==="Zabbix"),d=all.filter(e=>e.source==="Dynatrace");
    $("#integrated-map").innerHTML=`<a href="${serviceHref(focusName,state.host,z[0]?.id||'')}" class="context-node"><span class="context-node-icon zabbix-icon">▤</span>${sourceTag('Zabbix')}<h3>Infraestructura</h3><strong>${z.length} ${z.length===1?'evento':'eventos'}</strong><p>${hostResources.length?hostResources.map(x=>`${esc(x.host)}<br>CPU ${x.cpu}% · Mem ${x.memory}% · Disco ${x.disk}%`).join('<br>'):'Sin métricas de host representadas'}</p><small>Trigger e historia del recurso ↗</small></a><span class="relation-connector">↔<small>servicio<br>host / periodo</small></span><a href="${serviceHref(focusName,state.host,d[0]?.id||'')}" class="context-node"><span class="context-node-icon dynatrace-icon">⌁</span>${sourceTag('Dynatrace')}<h3>Aplicación</h3><strong>${d.length} ${d.length===1?'señal':'señales'}</strong><p>${m.hasApp?`p95 de referencia: ${compactNumber(m.latency)} ms<br>Errores de referencia: ${compactNumber(m.errors,1)} %`:'Sin APM representado para este servicio'}</p><small>Problema, respuesta y diagnóstico ↗</small></a><span class="relation-connector">→<small>validación<br>pendiente</small></span><button class="context-node unknown-node" data-help="coverage" type="button"><span class="context-node-icon">?</span><span class="unknown-label">COBERTURA</span><h3>Resultado funcional</h3><strong>Sin medición</strong><p>Intermediario no observado.<br>Recuperación por comprobar.</p><small>Qué falta validar ↗</small></button>`;
    $("#focus-evidence").innerHTML=`<span><b>Hipótesis por contrastar:</b> ${focusName==='Flujo Aurora'?'disco, latencia y errores comparten servicio y host; hay que revisar la secuencia.':'la relación de señales requiere validar el componente y su cobertura.'}</span><a class="button primary" href="${serviceHref(focusName,state.host)}">Abrir gráficas y evidencias ↗</a>`;
  }else{$("#integrated-map").innerHTML='<p class="no-data">No se infiere un estado saludable de la ausencia de eventos.</p>';$("#focus-evidence").innerHTML='';}
  const resourceName={cpu:'CPU',memory:'Memoria',disk:'Disco'}[state.resource];
  $("#resource-scope").textContent=`${resourceName} · Top ${state.top} · valores de referencia, no última muestra de la serie`;
  $("#overview-resources").innerHTML=r.map(x=>`<a class="resource-row resource-context-link" href="${serviceHref(x.service,x.host)}"><span>${esc(x.host)}<small>${esc(x.service)}</small></span><div class="bar-track"><div class="bar-fill" style="width:${x[state.resource]}%;background:${x[state.resource]>=90?'#bd3243':x[state.resource]>=75?'#c27921':'#377ca7'}"></div></div><strong>${x[state.resource]} %</strong></a>`).join('')||'<p class="no-data">Sin métricas representadas para estos servicios/hosts.</p>';
  const factor=focusName==='Flujo Aurora'?1:focusName==='Interfaz Boreal'?.62:.37;
  $("#focus-trend-title").textContent=focus?`Aplicación y recursos · ${focusName}`:'Respuesta de aplicación y recursos';
  $("#overview-trends").innerHTML=focus?`<article class="overview-trend"><div>${sourceTag('Dynatrace')}<h3>Respuesta de aplicación · p95</h3></div>${m.hasApp?lineChart([{values:p95.map(v=>Math.round(v*factor)),color:'#7960b6'}]):'<p class="no-data">Sin serie APM representada para este servicio.</p>'}<a class="footer-link" href="${serviceHref(focusName,state.host)}">Ampliar / ver muestras ↗</a></article><article class="overview-trend"><div>${sourceTag('Zabbix')}<h3>${focusName==='Flujo Aurora'?'Disco del host':'Recursos del host'}</h3></div>${focusName==='Flujo Aurora'?lineChart([{values:diskLine,color:'#c27921'}],{max:100,suffix:'%',threshold:90}):hostResources.length?`<div class="resource-summary">${hostResources.map(x=>`<p><b>${esc(x.host)}</b><span>CPU ${x.cpu}% · Memoria ${x.memory}% · Disco ${x.disk}%</span></p>`).join('')}</div>`:'<p class="no-data">Sin métrica de host representada.</p>'}<a class="footer-link" href="${serviceHref(focusName,state.host)}">Abrir contexto del host ↗</a></article><article class="overview-trend apdex-summary"><div>${sourceTag('Dynatrace')}<h3>Experiencia · Apdex</h3></div><button class="apdex-open" data-help="apdex" type="button"><strong>${m.apdex===null?'Sin muestra':compactNumber(m.apdex,2)}</strong><span>${m.apdex===null?'No se infiere a partir de eventos':'Índice de ejemplo recibido · 0 a 1'}</span></button><p>Cobertura, población y umbrales por validar. No equivale a disponibilidad ni éxito funcional.</p><button class="footer-link" data-help="apdex" type="button">Significado y condiciones ↗</button></article>`:'<p class="no-data">Selecciona un contexto con señales para explorar las métricas.</p>';
  $("#host").value=state.host;$("#eventState").value=state.eventState;
}

const renderWithOriginalContext=render;
render=function(){renderWithOriginalContext();renderIntegratedOverview();};
const originalChartRender=renderCharts;
renderCharts=function(){
  originalChartRender();
  const errSeries=errorSeriesForSelection();
  if(errSeries.length){
    $('#errors-chart').innerHTML=lineChart(errSeries,{max:6,suffix:'%',threshold:2});
    $('#errors-chart').closest('.chart-panel').querySelector('.chart-legend').innerHTML=errSeries.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('');
  }
  if(!latencySeries().length){
    $('#latency-chart').innerHTML='<p class="no-data">Sin serie APM representada para este servicio/host.</p>';
    $('#errors-chart').innerHTML='<p class="no-data">Sin serie de errores representada para este servicio/host.</p>';
    $('#errors-chart').closest('.chart-panel').querySelector('.chart-legend').innerHTML='';
  }
};
const setOriginalView=setView;
setView=function(view,update=true){
  setOriginalView(view,update);
  ['host','eventState'].forEach(k=>$('#'+k).closest('label').hidden=view==='charts'||view==='service');
};
const originalControlSync=syncControls;
syncControls=function(){originalControlSync();$('#host').value=state.host;$('#eventState').value=state.eventState;};
// Preserve metric semantics: an event count is not an Apdex sample or a latency series.
const originalMetricContext=metricContext;
metricContext=function(metric,mode='view'){
  if(metric==='resources'){
    const rows=resourceSelection();
    const label={cpu:'CPU (%)',memory:'Memoria (%)',disk:'Disco (%)'}[state.resource];
    const graph='<div class="resource-chart">'+resourceRowsMarkup(rows)+'</div>';
    const table=rows.map(r=>`<tr><td>${esc(r.host)}</td><td>${esc(r.service)}</td><td>${r[state.resource]} %</td></tr>`).join('');
    openInspector({title:'Recursos de infraestructura',graph,rows:table,label,description:'Valores ficticios de referencia. Este inspector conserva exactamente el conjunto de hosts del panel de origen.',firstColumn:'Host',secondColumn:'Servicio'},metric,mode);
    return;
  }
  if(['latency','errors'].includes(metric)&&!latencySeries().length){
    openInspector({title:metric==='latency'?'Tiempo de respuesta p95':'Errores de aplicación',graph:'<p class="no-data">Sin serie representada para este servicio/host. No se infiere a partir de los eventos.</p>',rows:'',label:metric==='latency'?'p95 (ms)':'Errores (%)',description:'Falta una serie explícita de la fuente para esta selección.',firstColumn:'Tiempo',secondColumn:'Servicio'},metric,mode);
    return;
  }
  if(metric==='errors'){
    const series=errorSeriesForSelection();
    const rows=series.flatMap(s=>s.values.map((v,i)=>`<tr><td>${i===11?'Ahora':`Hace ${Math.round(state.period*(1-i/11))} min`}</td><td>${esc(s.name)}</td><td>${v.toFixed(2)}</td></tr>`)).join('');
    openInspector({title:'Errores técnicos por servicio',graph:lineChart(series,{max:6,suffix:'%',threshold:2}),rows,label:'Errores (%)',description:'Series ficticias de Dynatrace; no se deduce el resultado funcional a partir de HTTP.',firstColumn:'Tiempo',secondColumn:'Servicio'},metric,mode);
    return;
  }
  originalMetricContext(metric,mode);
  if(metric==='apdex'){
    $('#inspector-content').insertAdjacentHTML('beforeend','<div class="metric-definition"><button class="button subtle" type="button" data-help="apdex">Qué significa APDEX y qué falta validar</button><p>Valor ficticio recibido de la fuente; las alertas no son el denominador de Apdex.</p></div>');
  }
};
function resourceSelection(){
  if(preview?.kind!=='service'&&state.view==='overview')return contextResources(visibleEvents());
  return resources.filter(r=>(state.service==='all'||r.service===state.service)&&(state.host==='all'||r.host===state.host)).sort((a,b)=>b[state.resource]-a[state.resource]).slice(0,state.top);
}
function resourceRowsMarkup(rows){return rows.map(r=>`<div class="resource-row"><span>${esc(r.host)}</span><div class="bar-track"><div class="bar-fill" style="width:${r[state.resource]}%;background:${r[state.resource]>=90?'#bd3243':r[state.resource]>=75?'#c27921':'#377ca7'}"></div></div><strong>${r[state.resource]} %</strong></div>`).join('')||'<p class="no-data">Sin recursos representados para esta selección.</p>';}
document.addEventListener('DOMContentLoaded',()=>{
  [...new Set(events.map(e=>e.host))].sort().forEach(host=>{const o=document.createElement('option');o.value=host;o.textContent=host;$('#host').append(o);});
  ['host','eventState'].forEach(k=>$('#'+k).addEventListener('change',e=>{state[k]=e.target.value;render();syncURL();updateLocation();}));
  $('#resource').addEventListener('change',renderIntegratedOverview);$('#top').addEventListener('change',renderIntegratedOverview);
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-source-filter]');if(!button)return;
    e.preventDefault();e.stopImmediatePropagation();state.source=state.source===button.dataset.sourceFilter?'all':button.dataset.sourceFilter;syncControls();render();syncURL();updateLocation();
    explanation('integration','Eventos filtrados; contexto conservado','La herramienta filtra las señales. El detalle de servicio reúne las dos fuentes para contrastar recursos y aplicación. Este aviso es propio del HTML.');
  },true);
  render();setView(state.view,false);syncControls();syncURL();updateLocation();
});
