# ProcureAI - Bidder Gateway & Evaluator Suite

An AI-powered, cryptographically secure Tender Evaluation and Eligibility Analysis platform built for government procurement. This repository contains the complete ecosystem for both bidders and procurement officers.

## 📁 Project Structure

- **`bidder-gateway/`**: Next.js portal for bidders to submit documents and track status.
- **`procure-ai/`**: Next.js command center for procurement officers to evaluate bids.
- **`procure-ai-backend/`**: FastAPI backend handling AI extraction and logic.

## 🚀 Getting Started

### 1. Bidder Gateway (Frontend)
```bash
cd bidder-gateway
npm install
npm run dev
```

### 2. Procure AI Evaluator (Frontend)
```bash
cd procure-ai
npm install
npm run dev
```

### 3. Backend Services
```bash
cd procure-ai-backend
# Setup virtual environment and install requirements
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Run the application (command varies by app entry point)
```

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python
- **AI**: Gemini 2.0 Flash
- **State Management**: Zustand
