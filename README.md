Numerical Methods — Static Web Calculator

How to run:

Open `index.html` in a browser (double-click) or serve with a local static server. Example using Python 3:

```bash
cd d:\CODING\numerical-web
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Shirokazuki Anime backend:

PHP / InfinityFree deployment:

1. Upload semua file ke folder root InfinityFree Anda.
2. Buka `config.php` dan isi konfigurasi Gmail SMTP dengan akun Anda.
   - Untuk Gmail, gunakan app password bila verifikasi dua langkah aktif.
   - Atur `BASE_URL` ke alamat situs InfinityFree Anda.
3. Pastikan `data/users.json` dapat ditulis oleh server.
4. Buka `https://your-infinityfree-domain.epizy.com/anime.html`.

Node backend (opsional lokal):

1. Copy `.env.example` ke `.env`.
2. Isi Gmail SMTP credentials dan `BASE_URL`.
3. Install dependencies dan jalankan server:

```bash
cd d:\CODING\numerical-web
npm install
npm start
```

4. Buka http://localhost:3000/anime.html di browser.

Files:
- index.html — UI
- style.css — styles
- anime.html — halaman anime ongoing
- anime.css — gaya untuk halaman anime
- config.php — konfigurasi PHP Gmail SMTP dan BASE_URL
- common.php — helper backend PHP
- mail.php — SMTP mail helper
- register.php — endpoint pendaftaran
- login.php — endpoint login
- profile.php — endpoint profile
- forgot_password.php — endpoint permintaan reset
- reset_password.php — endpoint reset password
- data/users.json — penyimpanan akun sederhana (termasuk akun developer)
- package.json — backend dependencies untuk Node opsional
- server.js — Express API untuk auth dan reset password (lokal saja)
- .env.example — contoh konfigurasi SMTP untuk Node
- src/methods.js — numerical methods implementations
- src/main.js — UI glue
- src/anime.js — logika pencarian, register, dan reset password

Developer account:
- username: `developer`
- password: `dev1234`
- email: `developer@shirokazuki.local`

Quick examples (use the "Contoh" button on each panel to load):
- Eliminasi Gauss: augmented matrix for system in sample is preloaded.
- Gauss-Seidel: A=\n 4,1,2\n 3,5,1\n 1,1,3 and b=4,7,3
- Bagi Dua: `Math.pow(x,2)-2`, interval [1,2]
- Secant: `Math.cos(x)-x`, x0=0, x1=1
- Newton interp: xs=0,1,2 ys=1,3,7 evaluate at 1.5
- Trapesium: `Math.sin(x)`, a=0, b=pi, n=100
- RK4: dy/dx = x+y, x0=0,y0=1,h=0.1,steps=10

Notes:
- Functions must be valid JavaScript expressions using `x` (and `y` for ODEs). Use `Math.` for trig and pow, e.g. `Math.sin(x)` or `Math.pow(x,2)`.
- For linear systems, enter augmented matrix rows separated by newlines, elements by commas.
- The app uses `new Function(...)` to evaluate expressions; do not run untrusted code.

Theme:
- A theme toggle is available in the header to switch between dark (default) and light modes. Preference is saved in your browser.
