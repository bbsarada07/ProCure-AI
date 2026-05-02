# ProCure-AI: Central Evaluation & Audit Portal

## ProCure-AI (Admin) is the internal government-facing interface designed for the 2026 Procurement Modernization initiative. This dashboard provides evaluators with a "glass-box" view into the AI’s decision-making process, ensuring that every tender award is backed by verifiable data and GFR compliance logs.

## Evaluator Core Workflow

1. The Secure Audit Ledger: A real-time terminal feed that logs every action taken by the AI models during the "Auto-Structuring" phase, providing a 100% transparent trail for future audits.

2. Recursive Compliance Checking: Automated verification of vendor-submitted Financial Statements and GSTIN records against stored GFR logic gates.

3. Decision Dossier Generation: The portal finalizes evaluation by generating a tamper-proof dossier, ready for Director-level approval and digital export.

4. Live Submission Tracking: A centralized view for government officials to track the progress of active tenders as vendors move through the verification pipeline.

## Monitor-Optimized UI/UX

1. Enterprise Dashboard Design: Built for high-resolution desktop monitors at government offices, featuring a widescreen "Control Center" layout.

2. Immersive Evaluation Mode: A dedicated "Step-by-Step" review flow that allows evaluators to watch the AI verify documents in real-time.

3. High-Fidelity Document Previews: An in-browser preview system that simulates physical A4 documents, complete with print and export utilities.

## Project Structure

The repository is organized to separate the high-performance backend processing from the immersive administrator frontend.

```
ProCure-AI/
├── bidder-gateway/             # Frontend: Next.js Admin/Evaluator Portal
│   ├── src/
│   │   ├── app/                # Next.js App Router (Dashboard, Track, Preview)
│   │   ├── components/         # Reusable UI (Navigation, Audit Ledger, Banners)
│   │   ├── context/            # Global state for document verification
│   │   └── lib/                # Utility functions (Formatting, PDF Logic)
│   └── public/
│       └── demo_assets/        # Mock PDFs and Scanned SVGs for demo flow
├── procure-ai-backend/         # Backend: FastAPI & AI Logic
│   ├── app/
│   │   ├── api/                # API Endpoints (Extraction, Evaluation)
│   │   ├── services/           # LLM Integration (Gemini-2.0-Flash)
│   │   └── models/             # Pydantic schemas for GFR compliance
│   └── .env.example            # Template for environment variables
└── .gitignore                  # Root-level security configuration

```

## System Architecture

ProCure-AI follows a Decoupled Micro-Frontend Architecture designed for high security and rapid data processing.

1. Ingestion Layer: The Admin Portal captures physical documents via a "Vision-Simulated" camera or digital PDF uploads.

2. Processing Layer (Gemini-2.0-Flash): Documents are sent to the FastAPI backend where the AI performs "Semantic Chunking." It extracts specific criteria (e.g., Annual Turnover, GSTIN status) based on GFR 2017 logic.

3. Audit Layer (Secure Ledger): Every extraction result is hashed and logged to the "Secure Audit Ledger" in the UI. This ensures transparency and prevents "AI Hallucinations" from affecting the final award decision.

4. Presentation Layer: The processed data is re-structured into a "Dossier Preview" which utilizes native browser APIs (Print/WebShare) to integrate with existing government paper-trails.


## Technical Implementation

Framework: Next.js (Client Component Optimized).

Logic Engine: Gemini 2.0 Flash for semantic analysis of bidder documents.

Native Integrations: Leverages Web Share and Print APIs for official government workflow integration.

Data Handling: Secure environment management to prevent API leakage, utilizing a robust .gitignore architecture.

## How to Launch the Evaluator Portal

Clone the project:

Bash
```
git clone https://github.com/bbsarada07/ProCure-AI.git
```

Enter the Portal Directory:

Bash
```
cd procure-ai-evaluator-portal
```

Install & Start:

Bash
```
npm install && npm run dev
```

Official Evaluation Entry - Hackathon 2026

Team: ProCure-AI
