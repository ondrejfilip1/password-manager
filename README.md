
<h1 align="center">Správce hesel</h1>
<ul>
  <li><a href="https://app-62zq.onrender.com/">🌐 Webová verze</a></li>
  <li>Webová aplikace pro správu hesel</li>
  <li>Obsahuje přihlašovací a registrovací systém s dvoufázovým ověřením (2FA)</li>
  <li>Hesla jsou šifrována pomocí <a href="https://cs.wikipedia.org/wiki/Advanced_Encryption_Standard">AES-256</a></li>
</ul>

## ⚙️ Technologie

<p>Projekt byl vytvořen v <a href="https://www.mongodb.com/resources/languages/mern-stack">MERN</a> stacku</p>

- **Client:** React + Vite, Axios, shadcn/ui, TailwindCSS, Lucide

- **Server:** Node, Express, MongoDB, Mongoose, JWT (JSON Web Token), Nodemailer

## 🚀 Instalace a spuštění

Client

```bash
  cd client
  npm install
  npm run dev
```
Server

```bash
  cd server
  npm install
  npm start
```
## ✅ TODO

- Logout button v nastavení
- Více barevných motivů
- Možnost pro inputy při přidávání hesla (telefon, email, jméno)
- Animace na hover
- Zobrazení jen domény stránky v dashboardu (odebrání https://)
