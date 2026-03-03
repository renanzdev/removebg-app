# RemoveBG - Background Remover

Minimal web app to remove image backgrounds instantly.

No signup.  
No noise.  
Just clean PNGs.

---

## 🚀 Live Demo

👉 https://removebg-app.vercel.app

---

## ✨ Features

- Upload an image
- Remove background instantly
- Download clean PNG
- No authentication
- No ads
- No watermarks

---

## 🧠 Tech Stack

 <a href="https://developer.mozilla.org/" target="_blank" rel="noreferrer">
    <img src="https://skillicons.dev/icons?i=react,vite,vercel&perline=11" alt="My Skills" />
 </a>


- React + Vite
- Vercel Serverless Functions
- remove.bg API
- Vanilla CSS (Apple-inspired UI)

---

## 🖥️ How It Works

1. Upload an image
2. Image is sent to a serverless API
3. Background is removed using remove.bg
4. Result is returned as a PNG
5. Download instantly

---

## 🔐 Environment Variables

Create a `.env` file and add:

```env
REMOVE_BG_API_KEY=your_remove_bg_api_key
