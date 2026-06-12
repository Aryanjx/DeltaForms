# ⚡ DeltaForms

An AI-powered, full-stack SaaS form generation platform that transforms natural language prompts into completely styled, production-ready web forms in seconds. Built using the modern MERN stack, Tailwind CSS, and the Google Gemini Pro API.

---

## 🚀 Features

- **Natural Language Form Generation:** Enter a prompt like *"Create a customer registration form with name, email, and a 5-star experience rating"*, and the Google Gemini Pro engine instantly structures a validated JSON layout schema.
- **Dynamic Preview Canvas:** A real-time React render canvas that dynamically builds inputs, textareas, dropdowns, and rating components instantly from the AI payload.
- **SaaS Core Layout:** Modern, high-converting landing page showcasing glassmorphic aesthetics, fluid responsive layouts, interactive pricing modules, and functional FAQ accordions.
- **Flexible Data Layer:** Utilizing MongoDB's document-based store to easily house variable length, unstructured form blueprints without complex database migrations.
- **Tier-Based Access:** Integrated premium account filters (`💎 Premium Account` vs `🌱 Free Tier`) structurally bound to automated Stripe checkout pipelines.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (via Vite for optimized bundling)
- **Styling:** Tailwind CSS (Fluid utility architecture + Glassmorphism)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Model:** Mongoose ODM
- **Environment Management:** Dotenvx / Dotenv

### Core Services
- **AI Core Engine:** Google Gemini Pro API (`@google/genai` Node SDK)
- **Payment Processing:** Stripe Node Gateway

---

## 📦 Project Directory Structure

```text
deltaforms/
├── client/                 # Frontend Vite + React SPA
│   ├── src/
│   │   ├── components/     # UI Elements (LandingPage, Dashboard, etc.)
│   │   ├── App.jsx         # App router grid and state controls
│   │   └── main.jsx
│   └── package.json
└── server/                 # Backend Node.js + Express API
    ├── models/             # Mongoose DB Schemas (Form, Submission)
    ├── routes/             # API Endpoints (form routing, billing)
    ├── .env                # Local secrets configuration
    ├── index.js            # Core server listener entry point
    └── package.json
