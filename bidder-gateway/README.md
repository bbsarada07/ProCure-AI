#  Procure-AI: Bidder Gateway

**Streamlining Government Procurement through AI-Powered Audits and Automated GFR Compliance.**  
*Built for the AI for Bharat Hackathon 2026*

---

##  Overview

The **Procure-AI Bidder Gateway** is a secure, intelligent portal designed to revolutionize how vendors interact with government tenders. By leveraging multimodal AI, the platform eliminates manual bottlenecks in the procurement process. It allows bidders to upload or physically scan complex dossiers (Financial Statements, GSTINs, Experience Certificates), autonomously extracts critical criteria, and instantly audits the submission against General Financial Rules (GFR) standards.

###  Key Demo Features
* **Multimodal Document Ingestion:** Supports standard PDF uploads alongside a simulated "Physical Scan" feature for batch-processing physical papers via AI vision.
* **Instant AI Auto-Structuring:** Real-time extraction of financial turnover and statutory compliance data.
* **Secure Audit Ledger:** A live, transparent terminal view of the AI evaluation process.
* **Cryptographic Decision Dossiers:** Generates a printable, shareable, and downloadable A4 official evaluation dossier upon completion.

---

##  Tech Stack

**Frontend (Bidder Gateway)**
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Simulations:** Browser-native Web Share API, automated window printing

**Backend (Procure AI Engine)**
* **Framework:** Python / FastAPI
* **AI Model:** Google Gemini 2.0 Flash
* **Architecture:** RESTful endpoints for document intelligence and evaluation

---

##  Project Structure

This repository is built as a monorepo containing both the vendor-facing gateway and the backend AI engine:
```text
Procure-AI/
├── bidder-gateway/               # Next.js Frontend Application
│   ├── public/demo_assets/       # Static PDFs and mock scanned SVGs for live demo
│   ├── src/
│   │   ├── app/                  # Next.js routing (Dashboard, Submit, Track, Dossier)
│   │   └── components/           # Reusable UI components (TopNav, BottomNav)
│   ├── package.json
│   └── tailwind.config.ts
│
├── procure-ai-backend/           # Python FastAPI Backend
│   ├── app/
│   │   ├── api/endpoints/        # API routes (Extraction, Evaluation)
│   │   ├── services/             # Core LLM and Document Intelligence logic
│   │   └── main.py               # Application entry point
│   └── requirements.txt          # Python dependencies
│
└── README.md
```
---

 Getting Started (Local Development)
To run this project locally for demonstration or development purposes, follow these steps.

Prerequisites
Node.js (v18 or higher)

Python (3.9 or higher)

Google Gemini API Key (Required for backend AI services)

## 1. Running the Backend (FastAPI)

Open a terminal and navigate to the backend directory:

Bash
```
cd procure-ai-backend
```
Create and activate a virtual environment (Windows):

Bash
```
python -m venv venv
.\venv\Scripts\activate
```
Install the required Python packages:

Bash
```
pip install -r requirements.txt
```

Set up your environment variables:

1. Create a file named .env in the procure-ai-backend directory.

2. Add your Gemini API key:


Code snippet
```
GEMINI_API_KEY=your_actual_api_key_here

GEMINI_MODEL=gemini-2.0-flash
```
Start the backend server:

Bash
```
uvicorn app.main:app --reload
```
The API will be available at http://localhost:8000

## 2. Running the Frontend (Next.js)
Open a new terminal window and navigate to the frontend directory:

Bash
```
cd bidder-gateway
```
Install the Node dependencies:

Bash
```
npm install
```
Start the development server:

Bash
```
npm run dev
```
The Bidder Gateway will be available at http://localhost:3000

---

#  Live Demo Navigation Guide
 
For hackathon judges reviewing the local build, follow this "Happy Path" to experience the core functionality:

1. Navigate to /dashboard to view active tenders.

2. Click Start Submission on BSF-T012.

3. Instead of uploading individual rows, click Open Camera / Scan Document and select one of the mock SVG scan files to trigger the batch-processing demo.

4. Watch the accelerated AI Auto-Structuring loader transition to the Secure Audit Ledger.

5. Once the evaluation hits 100%, click View Decision Dossier to see the final, exportable output.

---

## Developed by our team for the AI for Bharat Hackathon.

---
