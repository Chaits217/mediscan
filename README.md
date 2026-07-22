# MediScan

**When seconds matter, one scan tells them everything.**

MediScan is a full-stack web app that gives emergency responders instant access to a person's critical medical information through a QR code — no login, no app download required.

🔗 **Live demo:** https://mediscan27.netlify.app
🔗 **Backend API:** https://mediscan-wam1.onrender.com/api/health

---

## The Problem

In a medical emergency — especially a road accident — the victim is often alone or unconscious. Bystanders and even paramedics have no way to know the person's blood group, allergies, or medical history during the critical first hour after an injury. This information gap can lead to delayed or incorrect treatment.

## The Solution

Each user creates a medical profile and gets a unique QR code. Anyone who scans it — with just a phone camera, no app, no login — instantly sees:

- Blood group and allergies (shown first, most critical)
- Chronic conditions and current medications
- An **AI-generated clinical summary** written in plain language
- Emergency contacts with one-tap call buttons
- Preferred hospital and insurance details

## Features

- 🔐 Secure signup/login (bcrypt password hashing + JWT)
- 📋 Create and edit a medical profile
- 📱 Auto-generated, downloadable QR code
- 🚑 Public, no-login emergency page for first responders
- 🤖 AI-generated clinical summary (regenerates on every edit)
- ☎️ One-tap call buttons for emergency contacts
- 📊 Scan logging, so the owner knows when their QR was accessed

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) |
| Auth | JWT + bcrypt |
| QR Generation | `qrcode` npm package |
| AI | Google Gemini API |
| Hosting | Render (backend), Netlify (frontend) |

## Project Structure

```
mediscan/
├── backend/          Node.js + Express API
│   └── src/
│       ├── models/       MongoDB schemas (User, Profile, ScanLog)
│       ├── controllers/  Business logic
│       ├── routes/       API routes (auth, profile, public)
│       ├── middleware/   JWT auth check
│       └── utils/        AI summary generation
└── frontend/         React (Vite) app
    └── src/
        ├── pages/         Signup, Login, Dashboard, Create/Edit Profile, Emergency Page
        └── api/           Axios instance with auth interceptor
```

## Running Locally

**Backend:**
```
cd backend
npm install
cp .env.example .env   # then fill in your MongoDB URI, JWT secret, and AI API key
npm run dev
```

**Frontend:**
```
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, connecting to the backend at `http://localhost:5000`.

## How It Works

1. A user signs up and creates their medical profile
2. The backend generates a unique, unguessable ID for that profile and a QR code pointing to `/emergency/<id>`
3. On every save, the profile data is sent to the AI API with a prompt instructing it to prioritize life-critical facts, and the resulting summary is cached
4. Anyone who scans the QR hits a public endpoint (no authentication) that returns the profile's emergency data and logs the scan
5. The emergency page renders that data with the most critical information (blood group, allergies) shown first

## Limitations

- Requires the QR code to be physically accessible (printed, on a phone case, or a bracelet)
- Data accuracy depends on the user keeping their profile updated
- Requires internet access to load the scan page
- Complements, but does not replace, professional medical alert systems

## Author

Built by Chaitali Mahajan.
