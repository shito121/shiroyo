// UI glue
function $(id){return document.getElementById(id)}

// Theme handling
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = $('theme-toggle');
  if(btn) btn.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
  try{ localStorage.setItem('nm_theme', theme); }catch(e){}
}
const savedTheme = (function(){ try{return localStorage.getItem('nm_theme')||'dark'}catch(e){return 'dark'}})();
applyTheme(savedTheme);

// simple nav
document.querySelectorAll('nav button').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));
    document.getElementById(b.dataset.target).classList.remove('hidden');
  });
});

function safeParseFloats(s){
  return s.split(',').map(t=>{
    const v=parseFloat(t);
    return Number.isFinite(v)?v:NaN;
  });
}

function setText(id, txt){ $(id).textContent = txt }

function loadExample(id, data){
  for(const k in data) if($(k)) $(k).value = data[k];
}

// Examples
const examples = {
  gauss: { 'gauss-matrix': '2,1,-1,8\n-3,-1,2,-11\n-2,1,2,-3' },
  gs: { 'gs-A':'4,1,2\n3,5,1\n1,1,3', 'gs-b':'4,7,3', 'gs-x0':'0,0,0' },
  bis: { 'bis-f':'Math.pow(x,2)-2', 'bis-a':'1', 'bis-b':'2' },
  sec: { 'sec-f':'Math.cos(x)-x', 'sec-x0':'0', 'sec-x1':'1' },
  newt:{ 'new-xs':'0,1,2','new-ys':'1,3,7','new-x':'1.5' },
  trap:{ 'trap-f':'Math.sin(x)','trap-a':'0','trap-b':'3.1415926535','trap-n':'100' },
  rk:{ 'rk-f':'x + y','rk-x0':'0','rk-y0':'1','rk-h':'0.1','rk-steps':'10' }
};

const sampleSets = {
  gauss: [
    {label:'Sistem 2x2', matrix:'2,1,5,10\n1,-1,2,3'},
    {label:'Sistem 3x3 #1', matrix:'1,1,1,6\n0,2,5,-4\n2,5,-1,27'},
    {label:'Sistem 3x3 #2', matrix:'3,2,-4,3\n2,3,3,15\n5,-3,1,14'},
    {label:'Sistem 3x3 #3', matrix:'2,-1,1,3\n1,1,-1,0\n3,-1,2,4'},
    {label:'Sistem 3x3 #4', matrix:'4,2,0,2\n2,4,1,4\n0,1,3,7'},
    {label:'Sistem 3x3 #5', matrix:'1,2,3,14\n2,3,1,10\n3,1,2,11'},
    {label:'Sistem 3x3 #6', matrix:'2,3,1,10\n1,-2,3,4\n3,1,-1,2'},
    {label:'Sistem 3x3 #7', matrix:'1,0,2,8\n0,3,-1,1\n2,1,1,7'},
    {label:'Sistem 4x4 #1', matrix:'1,0,2,-1,2\n0,1,-1,3,1\n3,-1,2,1,9\n2,1,1,4,8'},
    {label:'Sistem 4x4 #2', matrix:'2,1,0,1,5\n1,2,1,0,6\n0,1,2,1,7\n1,0,1,2,8'}
  ],
  gs: [
    {label:'GS 1', A:'4,1,2\n3,5,1\n1,1,3', b:'4,7,3', x0:'0,0,0'},
    {label:'GS 2', A:'10,-1,2\n-1,11,-1\n2,-1,10', b:'6,25,-11', x0:'0,0,0'},
    {label:'GS 3', A:'5,2,1\n2,6,1\n1,1,4', b:'12,16,11', x0:'0,0,0'},
    {label:'GS 4', A:'6,2,1\n1,5,2\n1,2,4', b:'9,12,14', x0:'0,0,0'},
    {label:'GS 5', A:'4,1,0\n1,3,1\n0,1,5', b:'4,5,6', x0:'0,0,0'},
    {label:'GS 6', A:'7,2,1\n2,8,1\n1,1,5', b:'9,15,11', x0:'0,0,0'},
    {label:'GS 7', A:'8,1,1\n1,7,2\n1,2,9', b:'10,13,16', x0:'0,0,0'},
    {label:'GS 8', A:'9,2,1\n2,7,2\n1,1,8', b:'14,17,18', x0:'0,0,0'},
    {label:'GS 9', A:'10,1,2\n1,9,1\n2,1,7', b:'18,16,15', x0:'0,0,0'},
    {label:'GS 10', A:'8,3,1\n2,6,1\n1,1,5', b:'20,17,13', x0:'0,0,0'}
  ],
  bis: [
    {label:'Bis 1', f:'Math.pow(x,3)-x-2', a:'1', b:'2'},
    {label:'Bis 2', f:'Math.sin(x)-0.5', a:'0', b:'2'},
    {label:'Bis 3', f:'Math.log(x+1)-0.5', a:'0', b:'2'},
    {label:'Bis 4', f:'Math.pow(x,2)-3', a:'1', b:'2'},
    {label:'Bis 5', f:'Math.exp(x)-4', a:'1', b:'2'},
    {label:'Bis 6', f:'Math.cos(x)-0.2', a:'0', b:'1.5'},
    {label:'Bis 7', f:'Math.pow(x,3)-5', a:'1', b:'2'},
    {label:'Bis 8', f:'Math.sqrt(x)-1', a:'1', b:'4'},
    {label:'Bis 9', f:'Math.pow(x,4)-16', a:'1', b:'2.5'},
    {label:'Bis 10', f:'Math.pow(x,3)-8', a:'1', b:'3'}
  ],
  sec: [
    {label:'Sec 1', f:'Math.cos(x)-x', x0:'0', x1:'1'},
    {label:'Sec 2', f:'Math.log(x+1)-0.2', x0:'0', x1:'1'},
    {label:'Sec 3', f:'Math.sqrt(x)-2', x0:'1', x1:'4'},
    {label:'Sec 4', f:'Math.pow(x,2)-2', x0:'1', x1:'2'},
    {label:'Sec 5', f:'Math.sin(x)-0.5', x0:'0', x1:'2'},
    {label:'Sec 6', f:'Math.exp(x)-3', x0:'0', x1:'2'},
    {label:'Sec 7', f:'Math.pow(x,3)-1', x0:'0', x1:'2'},
    {label:'Sec 8', f:'Math.cos(x)-0.1', x0:'0', x1:'1'},
    {label:'Sec 9', f:'Math.pow(x,4)-16', x0:'1', x1:'2'},
    {label:'Sec 10', f:'Math.pow(x,3)-27', x0:'2', x1:'4'}
  ],
  new: [
    {label:'Newton 1', xs:'0,1,2', ys:'1,3,7', x:'1.5'},
    {label:'Newton 2', xs:'1,2,3', ys:'2,4,8', x:'2.5'},
    {label:'Newton 3', xs:'0,2,4', ys:'1,5,17', x:'3'},
    {label:'Newton 4', xs:'1,3,5', ys:'2,10,26', x:'4'},
    {label:'Newton 5', xs:'0,1,3', ys:'1,2,10', x:'2'},
    {label:'Newton 6', xs:'2,3,5', ys:'4,7,25', x:'4'},
    {label:'Newton 7', xs:'0,1,4', ys:'1,3,33', x:'2'},
    {label:'Newton 8', xs:'1,2,4', ys:'2,5,17', x:'3'},
    {label:'Newton 9', xs:'0,2,5', ys:'1,7,31', x:'3.5'},
    {label:'Newton 10', xs:'1,4,6', ys:'3,15,31', x:'5'}
  ],
  trap: [
    {label:'Trap 1', f:'Math.sin(x)', a:'0', b:'3.1415926535', n:'100'},
    {label:'Trap 2', f:'Math.cos(x)', a:'0', b:'1.5707963268', n:'100'},
    {label:'Trap 3', f:'x*x', a:'0', b:'2', n:'100'},
    {label:'Trap 4', f:'Math.exp(x)', a:'0', b:'1', n:'100'},
    {label:'Trap 5', f:'Math.log(x+1)', a:'0', b:'2', n:'100'},
    {label:'Trap 6', f:'x', a:'0', b:'5', n:'50'},
    {label:'Trap 7', f:'Math.sqrt(x)', a:'0', b:'4', n:'100'},
    {label:'Trap 8', f:'1/(1+x*x)', a:'0', b:'1', n:'100'},
    {label:'Trap 9', f:'Math.pow(x,3)', a:'0', b:'1', n:'100'},
    {label:'Trap 10', f:'Math.sin(x)*x', a:'0', b:'3.1415926535', n:'100'}
  ],
  rk: [
    {label:'RK4 1', f:'x + y', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 2', f:'y - x', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 3', f:'x - y', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 4', f:'x*y', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 5', f:'Math.sin(x) + y', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 6', f:'Math.cos(x) - y', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 7', f:'x + Math.cos(y)', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 8', f:'y + Math.exp(x)', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 9', f:'x - Math.exp(-y)', x0:'0', y0:'1', h:'0.1', steps:'10'},
    {label:'RK4 10', f:'Math.sin(x) - y', x0:'0', y0:'1', h:'0.1', steps:'10'}
  ]
};

function createPanelOptions(selectId, sampleArray){
  const sel=$(selectId);
  if(!sel) return;
  sel.innerHTML = '';
  sampleArray.forEach((item,index)=>{
    const opt = document.createElement('option');
    opt.value = String(index);
    opt.textContent = item.label;
    sel.appendChild(opt);
  });
}

function displaySample(method,id){
  const sel=$(id + '-sample');
  const out=$(id + '-sample-out');
  if(!sel || !out) return;
  const data = sampleSets[id][Number(sel.value)];
  if(!data) return;
  let text = 'Contoh: ' + data.label + '\n';
  try{
    switch(id){
      case 'gauss':{
        const sol = gaussianElimination(parseMatrixText(data.matrix));
        text += 'Matriks:\n' + data.matrix + '\nJawaban: ' + JSON.stringify(sol);
        break;
      }
      case 'gs':{
        const A = parseMatrixText(data.A);
        const b = safeParseFloats(data.b);
        const x0 = safeParseFloats(data.x0);
        const res = gaussSeidel(A,b,x0,1e-6,1000);
        text += 'A:\n' + data.A + '\nb: ' + data.b + '\nx0: ' + data.x0 + '\nJawaban: ' + JSON.stringify(res, null, 2);
        break;
      }
      case 'bis':{
        const f = new Function('x','return ' + data.f);
        const res = bisection(f,parseFloat(data.a),parseFloat(data.b),1e-6,1000);
        text += 'f(x): ' + data.f + '\na: ' + data.a + ', b: ' + data.b + '\nJawaban: ' + JSON.stringify(res, null, 2);
        break;
      }
      case 'sec':{
        const f = new Function('x','return ' + data.f);
        const res = secant(f,parseFloat(data.x0),parseFloat(data.x1),1e-6,1000);
        text += 'f(x): ' + data.f + '\nx0: ' + data.x0 + ', x1: ' + data.x1 + '\nJawaban: ' + JSON.stringify(res, null, 2);
        break;
      }
      case 'new':{
        const xs = safeParseFloats(data.xs);
        const ys = safeParseFloats(data.ys);
        const coeffs = dividedDifferences(xs, ys);
        const y = evalNewton(xs, coeffs, parseFloat(data.x));
        text += 'xs: ' + data.xs + '\nys: ' + data.ys + '\nx: ' + data.x + '\nJawaban: y = ' + y + '\nCoefficients: ' + JSON.stringify(coeffs);
        break;
      }
      case 'trap':{
        const f = new Function('x','return ' + data.f);
        const val = trapezoid(f,parseFloat(data.a),parseFloat(data.b),parseInt(data.n,10));
        text += 'f(x): ' + data.f + '\na: ' + data.a + ', b: ' + data.b + ', n: ' + data.n + '\nJawaban: ' + val;
        break;
      }
      case 'rk':{
        const f = new Function('x','y','return ' + data.f);
        const res = rk4((x,y)=>f(x,y),parseFloat(data.x0),parseFloat(data.y0),parseFloat(data.h),parseInt(data.steps,10));
        text += 'dy/dx = ' + data.f + '\nx0: ' + data.x0 + ', y0: ' + data.y0 + ', h: ' + data.h + ', steps: ' + data.steps + '\nJawaban: ' + JSON.stringify(res, null, 2);
        break;
      }
    }
  }catch(e){text += 'Error: ' + e.message}
  out.textContent = text;
}

['gauss','gs','bis','sec','new','trap','rk'].forEach(id=>{
  createPanelOptions(id + '-sample', sampleSets[id]);
});

// wire sample run buttons
[['gauss-sample-run','gauss'],['gs-sample-run','gs'],['bis-sample-run','bis'],['sec-sample-run','sec'],['new-sample-run','new'],['trap-sample-run','trap'],['rk-sample-run','rk']].forEach(([btn,id])=>{
  const el=$(btn);
  if(el) el.addEventListener('click', ()=> displaySample(id, id));
});

// wire example buttons
[['gauss-example','gauss'],['gs-example','gs'],['bis-example','bis'],['sec-example','sec'],['new-example','newt'],['trap-example','trap'],['rk-example','rk']].forEach(([btn,key])=>{
  const el=$(btn);
  if(el) el.addEventListener('click', ()=> loadExample(null, examples[key]));
});

// theme toggle button
const tbtn = $('theme-toggle');
if(tbtn){
  tbtn.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
}

// Group menu (three-dot) toggle
const gmBtn = $('group-menu');
const gmDrop = $('group-dropdown');
if(gmBtn && gmDrop){
  function openGroupMenu(){ gmDrop.classList.remove('hidden'); gmDrop.setAttribute('aria-hidden','false'); }
  function closeGroupMenu(){ gmDrop.classList.add('hidden'); gmDrop.setAttribute('aria-hidden','true'); }
  gmBtn.addEventListener('click', (e)=>{ e.stopPropagation(); if(gmDrop.classList.contains('hidden')) openGroupMenu(); else closeGroupMenu(); });
  document.addEventListener('click', (e)=>{ if(!gmDrop.contains(e.target) && e.target !== gmBtn) closeGroupMenu(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeGroupMenu(); });
}

// Copy NPM and Print
const copyBtn = $('copy-npm');
const printBtn = $('print-list');
if(copyBtn){
  copyBtn.addEventListener('click', ()=>{
    const items = Array.from(gmDrop.querySelectorAll('ol li')).map(li=>li.textContent.trim()).join('\n');
    navigator.clipboard?.writeText(items).then(()=>{
      copyBtn.textContent = 'Disalin';
      setTimeout(()=> copyBtn.textContent = 'Salin NPM', 1200);
    }).catch(()=> alert('Tidak bisa menyalin ke clipboard'));
  });
}
if(printBtn){
  printBtn.addEventListener('click', ()=>{
    const w = window.open('', '_blank');
    const html = `<pre>${Array.from(gmDrop.querySelectorAll('ol li')).map(li=>li.textContent).join('\n')}</pre>`;
    w.document.write(`<html><head><title>Daftar Anggota</title></head><body>${html}</body></html>`);
    w.document.close();
    w.print();
  });
}

// Gaussian
$('gauss-run').addEventListener('click', ()=>{
  try{
    const mat = parseMatrixText($('gauss-matrix').value);
    if(!mat.length) throw new Error('Matriks kosong');
    const sol = gaussianElimination(mat);
    setText('gauss-out', JSON.stringify(sol));
  }catch(e){setText('gauss-out', e.message)}
});

// Gauss-Seidel
$('gs-run').addEventListener('click', ()=>{
  try{
    const A = parseMatrixText($('gs-A').value);
    const b = safeParseFloats($('gs-b').value);
    const x0 = safeParseFloats($('gs-x0').value);
    if(A.some(r=>r.some(v=>!Number.isFinite(v)))) throw new Error('Matriks A mengandung nilai tidak valid');
    if(b.some(v=>!Number.isFinite(v))) throw new Error('Vektor b tidak valid');
    const tol = parseFloat($('gs-tol').value) || 1e-6;
    const res = gaussSeidel(A,b,x0,tol,1000);
    setText('gs-out', JSON.stringify(res, null, 2));
  }catch(e){setText('gs-out', e.message)}
});

// Bisection
$('bis-run').addEventListener('click', ()=>{
  try{
    const fexpr = $('bis-f').value;
    const f = new Function('x','return ' + fexpr);
    const a = parseFloat($('bis-a').value), b = parseFloat($('bis-b').value);
    if(!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('Interval tidak valid');
    const tol = parseFloat($('bis-tol').value) || 1e-6;
    const res = bisection(f,a,b,tol,1000);
    setText('bis-out', JSON.stringify(res, null, 2));
  }catch(e){setText('bis-out', e.message)}
});

// Secant
$('sec-run').addEventListener('click', ()=>{
  try{
    const fexpr = $('sec-f').value;
    const f = new Function('x','return ' + fexpr);
    const x0 = parseFloat($('sec-x0').value), x1 = parseFloat($('sec-x1').value);
    if(!Number.isFinite(x0) || !Number.isFinite(x1)) throw new Error('x0/x1 tidak valid');
    const tol = parseFloat($('sec-tol').value) || 1e-6;
    const res = secant(f,x0,x1,tol,1000);
    setText('sec-out', JSON.stringify(res, null, 2));
  }catch(e){setText('sec-out', e.message)}
});

// Newton interpolation
$('new-run').addEventListener('click', ()=>{
  try{
    const xs = safeParseFloats($('new-xs').value);
    const ys = safeParseFloats($('new-ys').value);
    const x = parseFloat($('new-x').value);
    if(xs.length !== ys.length) throw new Error('Jumlah xs dan ys harus sama');
    const coeffs = dividedDifferences(xs, ys);
    const y = evalNewton(xs, coeffs, x);
    setText('new-out', 'y = ' + y + '\ncoeffs: ' + JSON.stringify(coeffs));
  }catch(e){setText('new-out', e.message)}
});

// Trapezoid
$('trap-run').addEventListener('click', ()=>{
  try{
    const fexpr = $('trap-f').value;
    const f = new Function('x','return ' + fexpr);
    const a = parseFloat($('trap-a').value), b = parseFloat($('trap-b').value);
    const n = parseInt($('trap-n').value,10) || 1;
    const val = trapezoid(f,a,b,n);
    setText('trap-out', String(val));
  }catch(e){setText('trap-out', e.message)}
});

// RK4
$('rk-run').addEventListener('click', ()=>{
  try{
    const fexpr = $('rk-f').value;
    const f = new Function('x','y','return ' + fexpr);
    const x0 = parseFloat($('rk-x0').value), y0 = parseFloat($('rk-y0').value);
    const h = parseFloat($('rk-h').value), steps = parseInt($('rk-steps').value,10) || 0;
    const res = rk4((x,y)=>f(x,y), x0, y0, h, steps);
    setText('rk-out', JSON.stringify(res, null, 2));
  }catch(e){setText('rk-out', e.message)}
});
