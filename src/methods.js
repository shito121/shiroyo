// Core numerical methods

function parseMatrixText(txt){
  return txt.trim().split(/\r?\n/).map(r=>r.split(',').map(s=>parseFloat(s.trim())));
}

function gaussianElimination(aug){
  const n = aug.length;
  const A = aug.map(r=>r.slice());
  for(let i=0;i<n;i++){
    // pivot
    let max=i; for(let k=i+1;k<n;k++) if(Math.abs(A[k][i])>Math.abs(A[max][i])) max=k;
    if(Math.abs(A[max][i])<1e-12) throw new Error('Matrix singular or nearly singular');
    [A[i],A[max]]=[A[max],A[i]];
    // eliminate
    for(let j=i+1;j<n;j++){
      const factor = A[j][i]/A[i][i];
      for(let k=i;k<=n;k++) A[j][k] -= factor*A[i][k];
    }
  }
  // back substitution
  const x = new Array(n).fill(0);
  for(let i=n-1;i>=0;i--){
    let s = A[i][n];
    for(let j=i+1;j<n;j++) s -= A[i][j]*x[j];
    x[i] = s / A[i][i];
  }
  return x;
}

function gaussSeidel(A,b,x0, tol=1e-6, maxIter=1000){
  const n=A.length; let x = x0.slice();
  for(let iter=0;iter<maxIter;iter++){
    let maxDiff=0;
    for(let i=0;i<n;i++){
      let s=b[i];
      for(let j=0;j<n;j++) if(j!==i) s -= A[i][j]*x[j];
      const xiNew = s / A[i][i];
      maxDiff = Math.max(maxDiff, Math.abs(xiNew - x[i]));
      x[i]=xiNew;
    }
    if(maxDiff < tol) return {x,iter};
  }
  return {x,iter:maxIter};
}

function bisection(f,a,b,tol=1e-6,maxIter=100){
  let fa=f(a), fb=f(b);
  if(fa*fb>0) throw new Error('f(a) and f(b) must have opposite signs');
  let mid;
  for(let i=0;i<maxIter;i++){
    mid=(a+b)/2; const fm=f(mid);
    if(Math.abs(fm) < tol || (b-a)/2 < tol) return {root:mid,iter:i};
    if(fa*fm<=0){ b=mid; fb=fm; } else { a=mid; fa=fm; }
  }
  return {root:mid,iter:maxIter};
}

function secant(f,x0,x1,tol=1e-6,maxIter=100){
  let f0=f(x0), f1=f(x1);
  for(let i=0;i<maxIter;i++){
    if(Math.abs(f1 - f0) < 1e-15) throw new Error('Division by small number');
    const x2 = x1 - f1*(x1-x0)/(f1-f0);
    if(Math.abs(x2-x1) < tol) return {root:x2,iter:i};
    x0=x1; f0=f1; x1=x2; f1=f(x1);
  }
  return {root:x1,iter:maxIter};
}

function dividedDifferences(xs, ys){
  const n = xs.length; const table = ys.map(v=>[v]);
  for(let j=1;j<n;j++){
    for(let i=0;i<n-j;i++){
      const val = (table[i+1][j-1] - table[i][j-1]) / (xs[i+j] - xs[i]);
      table[i].push(val);
    }
  }
  return table.map(row=>row[ row.length-1 ]);
}

function evalNewton(xs, coeffs, x){
  let n = coeffs.length; let res = coeffs[n-1];
  for(let i=n-2;i>=0;i--){ res = res*(x - xs[i]) + coeffs[i]; }
  return res;
}

function trapezoid(f,a,b,n){
  n = Math.max(1,Math.floor(n));
  const h=(b-a)/n; let s=0.5*(f(a)+f(b));
  for(let i=1;i<n;i++) s += f(a + i*h);
  return s*h;
}

function rk4(f,x0,y0,h,steps){
  let x=x0, y=y0; const result = [{x,y}];
  for(let i=0;i<steps;i++){
    const k1 = f(x,y);
    const k2 = f(x + h/2, y + h*(k1/2));
    const k3 = f(x + h/2, y + h*(k2/2));
    const k4 = f(x + h, y + h*k3);
    y = y + (h/6)*(k1 + 2*k2 + 2*k3 + k4);
    x = x + h;
    result.push({x,y});
  }
  return result;
}

// Exports
if(typeof window !== 'undefined'){
  window.parseMatrixText = parseMatrixText;
  window.gaussianElimination = gaussianElimination;
  window.gaussSeidel = gaussSeidel;
  window.bisection = bisection;
  window.secant = secant;
  window.dividedDifferences = dividedDifferences;
  window.evalNewton = evalNewton;
  window.trapezoid = trapezoid;
  window.rk4 = rk4;
}
