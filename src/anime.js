const animeData = [
  {
    title: 'Fallen Kingdom Chronicle',
    episode: 'EP 16',
    status: 'Ongoing',
    day: 'Rabu',
    studio: 'Sapphire Works',
    rating: '8.7',
    genres: ['Action', 'Isekai', 'Fantasy'],
    summary: 'Pangeran baru berusaha menyatukan dunia sihir yang terpecah setelah kebangkitan naga tua.',
    palette: ['#2f4f72', '#0d1728']
  },
  {
    title: 'Midnight Highway',
    episode: 'EP 9',
    status: 'Ongoing',
    day: 'Kamis',
    studio: 'Neon Pulse',
    rating: '8.3',
    genres: ['Action', 'Shounen'],
    summary: 'Pembalap jalanan melintasi kota malam untuk menghentikan korporasi gelap yang mengendalikan ritme kota.',
    palette: ['#432d61', '#0f1222']
  },
  {
    title: 'Spellbound Princess',
    episode: 'EP 6',
    status: 'Ongoing',
    day: 'Senin',
    studio: 'Lotus Garden',
    rating: '8.4',
    genres: ['Romance', 'Fantasy'],
    summary: 'Seorang putri penjinak sihir bertemu prajurit asing yang mengubah takdir kerajaan dan hatinya.',
    palette: ['#3c1f38', '#131521']
  },
  {
    title: 'Astral Academy',
    episode: 'EP 12',
    status: 'Ongoing',
    day: 'Selasa',
    studio: 'Moonbeam Studio',
    rating: '8.9',
    genres: ['Isekai', 'Shounen', 'Fantasy'],
    summary: 'Siswa terpilih memasuki akademi antara dimensi dan menemukan mentor misterius dari dunia lain.',
    palette: ['#1b2a4a', '#07111e']
  },
  {
    title: 'Blade of the Ember King',
    episode: 'EP 5',
    status: 'Ongoing',
    day: 'Sabtu',
    studio: 'Phoenix Frame',
    rating: '8.5',
    genres: ['Action', 'Fantasy'],
    summary: 'Seorang pendekar muda mencari pedang terkutuk untuk melindungi desa dari makhluk bayangan.',
    palette: ['#331e1b', '#09121a']
  },
  {
    title: 'Digital Heartbreak',
    episode: 'EP 8',
    status: 'Ongoing',
    day: 'Minggu',
    studio: 'Pixel Story',
    rating: '8.1',
    genres: ['Romance', 'Sci-Fi'],
    summary: 'Cinta digital antara programmer dan AI menantang batasan kenyataan dan algoritma.',
    palette: ['#1b223a', '#081020']
  },
  {
    title: 'Riftwalkers',
    episode: 'EP 10',
    status: 'Ongoing',
    day: 'Jumat',
    studio: 'Eclipse Works',
    rating: '8.6',
    genres: ['Action', 'Isekai'],
    summary: 'Tim petualang melintasi celah realitas untuk menyelamatkan dunia yang mulai runtuh.',
    palette: ['#243149', '#061019']
  },
  {
    title: 'Celestial Couture',
    episode: 'EP 7',
    status: 'Ongoing',
    day: 'Kamis',
    studio: 'Aurora Art',
    rating: '8.2',
    genres: ['Romance', 'Fantasy'],
    summary: 'Desainer muda bersaing di dunia mode magis dengan gaun yang dapat mengubah takdir.',
    palette: ['#292b45', '#0d1424']
  }
];

const grid = document.getElementById('anime-grid');
const countEl = document.getElementById('anime-count');
const genreEl = document.getElementById('genre-count');
const updatedEl = document.getElementById('updated-count');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-row button');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotForm = document.getElementById('forgot-form');
const resetForm = document.getElementById('reset-form');
const loginUser = document.getElementById('login-user');
const loginPass = document.getElementById('login-pass');
const registerUser = document.getElementById('register-user');
const registerEmail = document.getElementById('register-email');
const registerPass = document.getElementById('register-pass');
const forgotEmail = document.getElementById('forgot-email');
const resetToken = document.getElementById('reset-token');
const resetPass = document.getElementById('reset-pass');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const resetMessage = document.getElementById('reset-message');
const tabs = document.querySelectorAll('.tab-btn');
const accountName = document.getElementById('account-name');
const logoutBtn = document.getElementById('logout-btn');
const body = document.body;

const authTokenKey = 'shirokazuki-token';

function getToken(){
  return localStorage.getItem(authTokenKey);
}

function setToken(token){
  if(token) localStorage.setItem(authTokenKey, token);
  else localStorage.removeItem(authTokenKey);
}

function apiFetch(path, options = {}){
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if(token) headers.Authorization = `Bearer ${token}`;
  return fetch(path, { ...options, headers });
}

function setActiveTab(tabId){
  tabs.forEach(button => {
    const section = document.getElementById(button.dataset.tab);
    const active = button.dataset.tab === tabId;
    button.classList.toggle('active', active);
    if(section) section.classList.toggle('active', active);
  });
}

function displayMessage(element, message, isError = true){
  if(!element) return;
  element.textContent = message;
  element.style.color = isError ? '#ff7a7a' : '#8de3ff';
}

function updateAuthState(loggedIn, username){
  body.classList.toggle('locked', !loggedIn);
  if(loginModal) loginModal.classList.toggle('hidden', loggedIn);
  if(logoutBtn) logoutBtn.classList.toggle('hidden', !loggedIn);
  if(accountName){
    accountName.textContent = loggedIn ? `Welcome, ${username}` : '';
    accountName.classList.toggle('hidden', !loggedIn);
  }
  if(loggedIn){
    renderAnime(animeData);
  } else {
    grid.innerHTML = '';
    countEl.textContent = '0';
    updatedEl.textContent = '0';
    genreEl.textContent = new Set(animeData.flatMap(item => item.genres)).size;
  }
}

async function loadProfile(){
  const token = getToken();
  if(!token){
    updateAuthState(false);
    return;
  }

  try{
    const res = await apiFetch('/profile.php');
    if(!res.ok) throw new Error('Not authenticated');
    const data = await res.json();
    updateAuthState(true, data.username);
  }catch(err){
    setToken(null);
    updateAuthState(false);
  }
}

async function handleLogin(event){
  event.preventDefault();
  displayMessage(loginError, '');
  const username = loginUser?.value.trim();
  const password = loginPass?.value || '';

  try{
    const res = await fetch('/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Login gagal');
    setToken(data.token);
    updateAuthState(true, data.username);
  }catch(error){
    displayMessage(loginError, error.message || 'Login gagal');
  }
}

async function handleRegister(event){
  event.preventDefault();
  displayMessage(registerError, '');
  const username = registerUser?.value.trim();
  const email = registerEmail?.value.trim();
  const password = registerPass?.value || '';

  try{
    const res = await fetch('/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Pendaftaran gagal');
    displayMessage(registerError, data.message || 'Pendaftaran berhasil. Silakan login.', false);
    setActiveTab('login-section');
  }catch(error){
    displayMessage(registerError, error.message || 'Pendaftaran gagal');
  }
}

async function handleForgot(event){
  event.preventDefault();
  displayMessage(resetMessage, '');
  const email = forgotEmail?.value.trim();

  try{
    const res = await fetch('/forgot_password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Gagal mengirim instruksi reset');
    displayMessage(resetMessage, data.message || 'Cek email untuk instruksi reset.', false);
    if(resetForm) resetForm.classList.remove('hidden');
  }catch(error){
    displayMessage(resetMessage, error.message || 'Gagal mengirim instruksi reset');
  }
}

async function handleReset(event){
  event.preventDefault();
  displayMessage(resetMessage, '');
  const token = resetToken?.value.trim();
  const password = resetPass?.value || '';

  try{
    const res = await fetch('/reset_password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Reset password gagal');
    displayMessage(resetMessage, data.message || 'Password berhasil direset.', false);
    setActiveTab('login-section');
  }catch(error){
    displayMessage(resetMessage, error.message || 'Reset password gagal');
  }
}

function applyQueryReset(){
  const params = new URLSearchParams(window.location.search);
  const token = params.get('resetToken');
  const email = params.get('email');
  if(token || email){
    setActiveTab('reset-section');
    if(resetToken && token) resetToken.value = token;
    if(forgotEmail && email) forgotEmail.value = decodeURIComponent(email);
    if(resetForm) resetForm.classList.remove('hidden');
  }
}

searchInput.addEventListener('input', () => applyFilter(document.querySelector('.filter-row button.active').dataset.filter));
filterButtons.forEach(button => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

tabs.forEach(button => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab));
});

loginForm?.addEventListener('submit', handleLogin);
registerForm?.addEventListener('submit', handleRegister);
forgotForm?.addEventListener('submit', handleForgot);
resetForm?.addEventListener('submit', handleReset);
logoutBtn?.addEventListener('click', () => {
  setToken(null);
  updateAuthState(false);
});

function initAuth(){
  loadProfile();
  applyQueryReset();
}

initAuth();

function buildCard(item){
  const article = document.createElement('article');
  article.className = 'anime-card';
  article.dataset.genres = item.genres.join(' ').toLowerCase();
  article.dataset.title = item.title.toLowerCase();
  article.dataset.summary = item.summary.toLowerCase();

  const thumb = document.createElement('div');
  thumb.className = 'card-thumb';
  thumb.style.background = `linear-gradient(180deg, ${item.palette[0]}, ${item.palette[1]})`;

  const tag = document.createElement('span');
  tag.className = 'card-tag';
  tag.textContent = item.episode;
  thumb.appendChild(tag);

  const status = document.createElement('span');
  status.className = 'card-status';
  status.textContent = item.status;
  thumb.appendChild(status);

  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <h2>${item.title}</h2>
    <p>${item.summary}</p>
    <div class="meta-row">
      <span class="meta-pill">Studio: ${item.studio}</span>
      <span class="meta-pill">Rating: ${item.rating}</span>
      <span class="meta-pill">Hari: ${item.day}</span>
    </div>
    <div class="genres">${item.genres.map(g => `<span class="genre-badge">${g}</span>`).join('')}</div>
  `;

  article.appendChild(thumb);
  article.appendChild(body);
  return article;
}

function renderAnime(list){
  grid.innerHTML = '';
  list.forEach(item => grid.appendChild(buildCard(item)));
  countEl.textContent = list.length;
  genreEl.textContent = new Set(animeData.flatMap(item => item.genres)).size;
  updatedEl.textContent = Math.min(list.length, 4);
}

function normalize(text){
  return String(text || '').toLowerCase();
}

function applyFilter(filter){
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  const query = normalize(searchInput.value);
  const filtered = animeData.filter(item => {
    const matchesGenre = filter === 'all' || item.genres.map(normalize).includes(normalize(filter));
    const matchesText = [item.title, item.summary, item.studio, ...item.genres].some(value => normalize(value).includes(query));
    return matchesGenre && matchesText;
  });
  renderAnime(filtered);
}

searchInput.addEventListener('input', () => applyFilter(document.querySelector('.filter-row button.active').dataset.filter));
filterButtons.forEach(button => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

loginForm?.addEventListener('submit', handleLogin);
logoutBtn?.addEventListener('click', handleLogout);

function initAuth(){
  updateAuthState(isAuthenticated());
}

initAuth();
