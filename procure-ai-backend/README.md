

#  Procure-AI: Backend Engine

**The intelligent core of the Procure-AI Bidder Gateway, powered by Google Gemini.**  
*Built for the AI for Bharat Hackathon 2026*

---

##  Overview

The **Procure-AI Backend** is a high-performance, asynchronous REST API built with FastAPI. It serves as the brain of the Bidder Gateway, handling complex document intelligence tasks. By integrating Google's Gemini 2.0 Flash multimodal model, it autonomously processes vendor dossiers (including physical scans and PDFs), extracts key financial and compliance metrics, and evaluates them against General Financial Rules (GFR) standards in real-time.

---

###  Core Capabilities
* **Multimodal Extraction:** Processes both structured PDFs and raw image scans (simulated physical documents) to extract critical bidder data (Turnover, GSTIN, Experience).
* **Automated GFR Auditing:** Evaluates extracted metrics against pre-defined government tender criteria using deterministic logic combined with AI reasoning.
* **Cryptographic Hashing:** Simulates secure block-linking for finalized decision dossiers to ensure audit trail integrity.
* **High-Speed Processing:** Built on FastAPI for asynchronous, non-blocking AI request handling, ensuring a seamless frontend user experience.

---

##  Tech Stack

* **Framework:** FastAPI (Python 3.9+)
* **Server:** Uvicorn
* **AI Provider:** Google Gemini API (`gemini-2.0-flash`)
* **Data Validation:** Pydantic
* **Environment Management:** `python-dotenv`

---

##  Architecture & Directory Structure

We utilize a modular, scalable directory structure to separate API routing from core AI business logic:

```text
procure-ai-backend/
├── app/
│   ├── api/
│   │   └── endpoints/        # API route definitions (e.g., extraction.py, evaluation.py)
│   ├── core/                 # Application configuration and state management
│   ├── models/               # Pydantic schemas for request/response validation
│   ├── services/             # Core business logic (Document Intelligence, LLM Integration)
│   ├── __init__.py
│   └── main.py               # FastAPI application initialization
├── .env                      # Environment variables (Ignored in Git)
├── .gitignore
├── requirements.txt          # Python dependencies
└── README.md
```
---

## Getting Started (Local Setup)

Follow these steps to run the backend engine locally.

Prerequisites
Python 3.9+ installed on your system.

A valid Google Gemini API Key (Get one from Google AI Studio).

1. Installation
Clone the repository and navigate to the backend directory:

Bash
```
cd procure-ai-backend
```
Create and activate a virtual environment:
Windows:

Bash
```
python -m venv venv
.\venv\Scripts\activate
```
Mac/Linux:

Bash
```
python3 -m venv venv
source venv/bin/activate
```
Install the required dependencies:

Bash
```
pip install -r requirements.txt
```

2. Environment Variables

Create a .env file in the root of the procure-ai-backend directory. This file is securely ignored by Git. Add your Gemini credentials:

Code snippet

# Google Gemini Configuration
```
GEMINI_API_KEY=your_actual_api_key_here

GEMINI_MODEL=gemini-2.0-flash
```

# Application Configuration

ENVIRONMENT=development

3. Running the Server

Start the FastAPI application using Uvicorn with hot-reloading enabled:

Bash
```
uvicorn app.main:app --reload
```
The API will start running at http://localhost:8000.

---

## Interactive API Documentation

FastAPI automatically generates interactive Swagger documentation. Once the server is running, you can explore and test the endpoints directly from your browser:

Swagger UI: http://localhost:8000/docs

ReDoc: http://localhost:8000/redoc

---

## Developed by our team for the AI for Bharat Hackathon.

---
