# 🌾 KrishiMitra+

### AI-Powered Crop Care & Fair Labour Matching for Rural India

**From Field to Future**

[![Live App](https://img.shields.io/badge/Live%20App-krishimitra--plus.netlify.app-2E7D32?style=for-the-badge)](https://krishimitra-plus.netlify.app)
[![Samsung Solve for Tomorrow](https://img.shields.io/badge/Samsung%20Solve%20for%20Tomorrow-2026-0d47a1?style=for-the-badge)](https://www.samsung.com/in/solvefortomorrow/)

Built by **Team AgriNova** for Samsung Solve for Tomorrow 2026 · Theme: *AI Living for India*

---

## 🔗 Live Demo

**App:** [krishimitra-plus.netlify.app](https://krishimitra-plus.netlify.app)

> Try it yourself: sign up, register as a Farmer or Worker, scan a crop leaf photo for instant AI disease detection, post or find agricultural jobs nearby.

---

## 📖 The Problem

India's rural economy faces two disconnected crises:

- **Crop losses:** Farmers lose a significant share of their harvest every year to diseases that go undetected until it's too late, due to limited access to agricultural experts (roughly 1 extension officer per 1,000+ farmers).
- **Labour mismatch:** Over 25 crore unorganized agricultural workers struggle to find consistent, fairly-paid seasonal work, while farmers struggle to find reliable labour when they need it most.

Existing apps only solve half the problem — crop-disease apps don't help find workers, and job-matching apps aren't built for agriculture, don't work offline, and ignore India's literacy and language barriers.

## 💡 Our Solution

**KrishiMitra+** is a single platform that solves both problems together:

1. **AI Crop Disease Scanner** — point your phone camera at a leaf, get an instant diagnosis with organic and chemical remedy suggestions, read aloud in your language.
2. **AI-Powered Labour Marketplace** — farmers post work needs, workers get matched by location, skill, and crop experience, with an AI-driven fair-wage suggestion to prevent exploitation.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **AI Crop Disease Detection** | Custom-trained deep learning model (MobileNetV2, transfer learning) identifies crop diseases from leaf photos with confidence scoring |
| 🗣️ **Voice Output** | Disease results and remedies read aloud via text-to-speech, supporting low-literacy users |
| 🌱 **Organic-First Remedies** | Every diagnosis shows an organic remedy alongside the chemical option — better for soil health and farmer costs |
| 👷 **Smart Labour Matching** | Workers and jobs sorted by district/state proximity, skill match, and crop experience |
| 💰 **AI Wage Predictor** | Suggests fair daily wages based on state and skill, to protect workers from underpayment |
| 🔐 **Full Authentication** | Email/password and Google OAuth sign-in, powered by Supabase Auth |
| 🌍 **Multi-Language Ready** | Built with i18n support for regional language expansion |
| 📍 **Complete Location Data** | All 28 states + 8 union territories with accurate district lists |
| ⭐ **Trust & Ratings** | Two-way rating system between farmers and workers |
| 📱 **Mobile-First Design** | Fully responsive, works on low-end Android devices |

---

## 🛠️ Tech Stack

**Frontend**
- [React 19](https://react.dev) + [Vite](https://vitejs.dev)
- [React Router v7](https://reactrouter.com)
- [Lucide React](https://lucide.dev) for icons

**Backend & Database**
- [Supabase](https://supabase.com) (PostgreSQL + Auth + Row Level Security)
- Supabase Auth — Email/Password and Google OAuth

**AI / Machine Learning**
- TensorFlow / Keras (MobileNetV2 transfer learning)
- Trained on the [PlantVillage Disease Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) (87,000+ images, 38 disease classes)
- Deployed via Gradio on [Hugging Face Spaces](https://huggingface.co/spaces)
- Accessed in-app using [`@gradio/client`](https://www.npmjs.com/package/@gradio/client)

**Deployment**
- [Netlify](https://netlify.com) (frontend hosting + CI/CD from GitHub)
- Hugging Face Spaces (AI model inference API)

---

## 📁 Project Structure

```
krishimitra-plus/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── images/              # Landing page hero image
│   └── _redirects           # Netlify SPA routing fix
├── src/
│   ├── components/          # Reusable UI components (Layout, Logo,
│   │                          BottomNav, Spinner, SkeletonCard, etc.)
│   ├── context/              # AppContext (auth + profile state),
│   │                          ToastContext (notifications)
│   ├── data/                  # Static data: India states/districts,
│   │                          wage tables, disease database
│   ├── i18n/                  # Translation strings
│   ├── lib/                   # Supabase client setup
│   ├── pages/                 # Route-level pages (Landing, Login,
│   │                          Signup, FarmerRegister, WorkerRegister,
│   │                          CropScanner, PostJob, FindWorkers,
│   │                          FindJobs, Rating, PrivacyPolicy, etc.)
│   ├── styles/                # Global CSS
│   ├── utils/                 # Form validation helpers
│   ├── App.jsx                 # Route definitions
│   └── main.jsx                 # App entry point
├── netlify.toml                  # Netlify build + redirect config
├── package.json
└── README.md
```

## 🏗️ How It Works

```
┌─────────────────┐      ┌──────────────────────┐      ┌─────────────────┐
│   React Web App   │ ───► │  Hugging Face Space    │ ───► │  Trained AI Model │
│  (Netlify)         │ ◄─── │  (Gradio API)          │ ◄─── │  (MobileNetV2)     │
└─────────────────┘      └──────────────────────┘      └─────────────────┘
        │
        ▼
┌─────────────────┐
│     Supabase        │
│  Auth + Database     │
│  + Row Level Security│
└─────────────────┘
```

1. User uploads/captures a leaf photo in the **Crop Scanner**
2. Image is sent to a **Hugging Face Space** running our custom-trained model
3. The model returns the predicted disease + confidence score
4. The app looks up a local remedy database and displays organic/chemical treatment, cause, and prevention tips
5. Result is read aloud using the Web Speech API
6. Meanwhile, **Supabase** handles user authentication, farmer/worker profiles, job postings, and applications — all matched using location and skill logic

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A free [Supabase](https://supabase.com) account
- A free [Hugging Face](https://huggingface.co) account (if you want to redeploy the AI model)

### Installation

```bash
git clone https://github.com/rekhashida/krishimitra-plus.git
cd krishimitra-plus
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🗄️ Database Setup

This project uses Supabase (PostgreSQL). The full schema — including all tables and Row Level Security policies — is in [`supabase/schema.sql`](./supabase/schema.sql).

To set up your own instance:
1. Create a new Supabase project
2. Open the SQL Editor
3. Paste and run the contents of `supabase/schema.sql`

**Tables created:**
- `farmers` — farmer profiles linked to auth users
- `workers` — worker profiles linked to auth users
- `jobs` — job postings
- `applications` — worker job applications
- `crop_scans` — history of AI disease scans
- `ratings` — two-way trust ratings between farmers and workers

All tables use Row Level Security: public read access for matching, owner-only write access for profile data.

---

## 🤖 AI Model Details

- **Architecture:** MobileNetV2 (transfer learning, ImageNet pre-trained)
- **Dataset:** PlantVillage augmented dataset (Kaggle)
- **Classes:** 10 common Indian crop diseases/healthy states (Tomato, Potato, Maize, Apple, Pepper)
- **Training:** Two-phase fine-tuning (frozen base → partial unfreeze), trained on Google Colab with GPU acceleration
- **Accuracy:** ~85-90% validation accuracy
- **Deployment:** Exported and served via a Gradio app on Hugging Face Spaces

---

## 🎯 Roadmap

- [ ] Expand AI model to cover more Indian-specific crops and diseases
- [ ] Add regional language UI translations (Hindi, Gujarati, Tamil, etc.)
- [ ] PWA support for installable offline-first experience
- [ ] SMS notifications for job matches (for users without constant data access)
- [ ] Expand labour marketplace to construction and other informal sectors
- [ ] Partner integration with Common Service Centres (CSCs) and Krishi Vigyan Kendras

---
## 📄 License

This project was built for educational and competition purposes as part of Samsung Solve for Tomorrow 2026.

---

## 🙏 Acknowledgements

- [PlantVillage Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) for training data
- [Supabase](https://supabase.com) for backend infrastructure
- [Hugging Face](https://huggingface.co) for AI model hosting
- [Netlify](https://netlify.com) for frontend deployment
- Samsung Solve for Tomorrow & IIT Delhi (FITT) for the opportunity

