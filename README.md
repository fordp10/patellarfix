# PatellarFix PWA 🦵

A Progressive Web App for patellar tendinopathy rehabilitation — same evidence-based protocol, zero Xcode required.

---

## Running on your iPhone — 3 steps

### Step 1 — Start the local server

Install [Node.js](https://nodejs.org) (LTS version) if you haven't already, then:

```bash
cd PatellarFix-PWA
npm install
npm run dev
```

You'll see output like:
```
  Local:   http://localhost:5173/
  Network: http://192.168.1.42:5173/
```

The **Network** URL is the one your iPhone needs. Make sure your iPhone and Mac are on the same WiFi network.

### Step 2 — Open on iPhone

On your iPhone, open **Safari** and type the Network URL from above (e.g. `http://192.168.1.42:5173`).

The app loads instantly — no cable, no Apple ID, no Xcode.

### Step 3 — Add to Home Screen

In Safari, tap the **Share button** (the box with an arrow) → **Add to Home Screen** → **Add**.

PatellarFix now lives on your home screen and works offline.

---

## Deploying online (optional — so you don't need the Mac running)

### Netlify (free, ~1 minute)

```bash
npm run build
```

Then drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop). You get a public URL like `patellarfix-xyz.netlify.app` that works on any device, anywhere, forever.

---

## Features

- ✅ Onboarding — pain level, activity level, symptom duration → assigns starting phase
- ✅ 3-phase evidence-based protocol (Rio, Kongsgaard, Alfredson/Purdam)
- ✅ Guided session mode with rest timers
- ✅ Strength + stretch on Mon/Wed/Fri, stretch only on other days
- ✅ Daily streak tracking with custom calendar
- ✅ Video + research links for every exercise
- ✅ Automatic phase advancement
- ✅ Offline-capable once installed

## Tech

- React 18 + Vite
- No UI library — custom CSS
- localStorage for persistence (no backend)
- PWA manifest + iOS Safari "Add to Home Screen"
