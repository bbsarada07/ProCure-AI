from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List
import asyncio
import json
import os
import io
import PyPDF2

# Import CrewAI
from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# --- Setup Groq LLM ---
agent_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2,
    num_retries=5
)

# --- Pydantic Models for the 4 Agents (Do Not Change) ---
class ExtractorOutput(BaseModel):
    document_id: str
    total_pages: int
    text_chunks: List[str] = Field(description="Normalized chunks of raw PDF text.")

class ParalegalOutput(BaseModel):
    deadlines: List[str] = Field(description="Extracted deadlines.")
    financial_figures: List[str] = Field(description="Extracted financial figures.")
    sla_obligations: List[str] = Field(description="Extracted SLA obligations.")

class RiskAssessorOutput(BaseModel):
    class Risk(BaseModel):
        clause: str
        severity: str = Field(description="Low, Medium, High, CRITICAL")
        explanation: str
    
    health_score: int = Field(description="Contract Health Score from 0 to 100")
    risks: List[Risk] = Field(description="List of legal exposures.")

class NegotiatorOutput(BaseModel):
    class CounterClause(BaseModel):
        original_clause: str
        plain_english_explanation: str
        safe_harbor_redline: str
    
    counter_clauses: List[CounterClause] = Field(description="Redline counter-clauses and explanations.")

class FinalReport(BaseModel):
    extractor: ExtractorOutput
    paralegal: ParalegalOutput
    risk_assessor: RiskAssessorOutput
    negotiator: NegotiatorOutput


# --- Helper: PDF Extraction ---
def extract_text_from_pdf(file_bytes: bytes) -> str:
    pdf_file = io.BytesIO(file_bytes)
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text


# --- The Live AI Streaming Engine ---
async def analyze_contract_stream(file_bytes: bytes, file_name: str):
    # 0. Prep Data
    yield f"data: {json.dumps({'agent': 'System', 'status': 'processing', 'message': f'Reading {file_name} into memory...'})}\n\n"
    await asyncio.sleep(0.5)
    
    try:
        raw_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        yield f"data: {json.dumps({'agent': 'System', 'status': 'error', 'message': 'Failed to read PDF.'})}\n\n"
        return
        
    # Prevent massive payloads from breaking token limits (Optimized for Groq Free Tier TPM Limits)
    safe_text = raw_text[:12000] 

    # ==========================================
    # AGENT 1: EXTRACTOR
    # ==========================================
    yield f"data: {json.dumps({'agent': 'Extractor', 'status': 'processing', 'message': 'Normalizing and chunking raw PDF text via Llama 3.3...'})}\n\n"
    
    extractor_agent = Agent(
        role='Data Extraction Specialist',
        goal='Read the raw contract and chunk it cleanly.',
        backstory='You are an expert AI paralegal clerk.',
        llm=agent_llm,
        verbose=True
    )
    task1 = Task(
        description=f'Analyze this contract text. Extract a summary of the chunks. Text: {safe_text}',
        expected_output='A structured JSON with document details and chunked text.',
        agent=extractor_agent,
        output_pydantic=ExtractorOutput
    )
    crew1 = Crew(agents=[extractor_agent], tasks=[task1])
    result1 = await asyncio.to_thread(crew1.kickoff)
    ext_data = result1.pydantic
    
    yield f"data: {json.dumps({'agent': 'Extractor', 'status': 'complete', 'message': 'Text extraction complete.', 'data': ext_data.model_dump()})}\n\n"
    
    # ==========================================
    # AGENT 2: PARALEGAL
    # ==========================================
    yield f"data: {json.dumps({'agent': 'Paralegal', 'status': 'processing', 'message': 'Preparing Paralegal agent analysis (cooldown)...'})}\n\n"
    await asyncio.sleep(12)
    yield f"data: {json.dumps({'agent': 'Paralegal', 'status': 'processing', 'message': 'Hunting for deadlines, financial figures, and SLA obligations...'})}\n\n"
    
    paralegal_agent = Agent(
        role='Senior Compliance Paralegal',
        goal='Find all money, dates, and SLA metrics.',
        backstory='You have a hawk-eye for financial commitments and deadlines.',
        llm=agent_llm,
        verbose=True
    )
    task2 = Task(
        description=f'Extract deadlines, financial figures, and SLAs from this contract text: {safe_text}',
        expected_output='A structured JSON of extracted obligations.',
        agent=paralegal_agent,
        output_pydantic=ParalegalOutput
    )
    crew2 = Crew(agents=[paralegal_agent], tasks=[task2])
    result2 = await asyncio.to_thread(crew2.kickoff)
    para_data = result2.pydantic

    yield f"data: {json.dumps({'agent': 'Paralegal', 'status': 'complete', 'message': 'Obligations extracted.', 'data': para_data.model_dump()})}\n\n"
    
    # ==========================================
    # AGENT 3: RISK ASSESSOR
    # ==========================================
    yield f"data: {json.dumps({'agent': 'Risk Assessor', 'status': 'processing', 'message': 'Preparing Risk Assessor agent analysis (cooldown)...'})}\n\n"
    await asyncio.sleep(12)
    yield f"data: {json.dumps({'agent': 'Risk Assessor', 'status': 'processing', 'message': 'Auditing legal exposures and calculating health score...'})}\n\n"
    
    risk_agent = Agent(
        role='Lead Risk Auditor',
        goal='Identify dangerous clauses, auto-renewals, and severe liabilities.',
        backstory='You protect the company from bad contracts. You are ruthless.',
        llm=agent_llm,
        verbose=True
    )
    task3 = Task(
        description=f'Identify high-risk clauses in this text. Score the contract health (0=Terrible, 100=Perfect). Text: {safe_text}',
        expected_output='A structured JSON of risks and a health score.',
        agent=risk_agent,
        output_pydantic=RiskAssessorOutput
    )
    crew3 = Crew(agents=[risk_agent], tasks=[task3])
    result3 = await asyncio.to_thread(crew3.kickoff)
    risk_data = result3.pydantic

    yield f"data: {json.dumps({'agent': 'Risk Assessor', 'status': 'complete', 'message': 'Risk assessment complete.', 'data': risk_data.model_dump()})}\n\n"
    
    # ==========================================
    # AGENT 4: NEGOTIATOR
    # ==========================================
    yield f"data: {json.dumps({'agent': 'Negotiator', 'status': 'processing', 'message': 'Preparing Negotiator agent analysis (cooldown)...'})}\n\n"
    await asyncio.sleep(12)
    yield f"data: {json.dumps({'agent': 'Negotiator', 'status': 'processing', 'message': 'Drafting plain-English explanations and safe-harbor redlines...'})}\n\n"
    
    negotiator_agent = Agent(
        role='General Counsel',
        goal='Rewrite bad clauses into safe harbor language.',
        backstory='You are a master negotiator who writes fair, plain-English contract amendments.',
        llm=agent_llm,
        verbose=True
    )
    
    # Pass the risks identified by Agent 3 to Agent 4
    risks_str = json.dumps([r.model_dump() for r in risk_data.risks])
    task4 = Task(
        description=f'Look at these identified risks: {risks_str}. For each risk, rewrite the original clause into a safer "safe-harbor redline" and explain why in plain English.',
        expected_output='A structured JSON of counter-clauses.',
        agent=negotiator_agent,
        output_pydantic=NegotiatorOutput
    )
    crew4 = Crew(agents=[negotiator_agent], tasks=[task4])
    result4 = await asyncio.to_thread(crew4.kickoff)
    neg_data = result4.pydantic

    yield f"data: {json.dumps({'agent': 'Negotiator', 'status': 'complete', 'message': 'Redlines drafted.', 'data': neg_data.model_dump()})}\n\n"

    # ==========================================
    # FINAL HANDOFF
    # ==========================================
    final_report = FinalReport(
        extractor=ext_data,
        paralegal=para_data,
        risk_assessor=risk_data,
        negotiator=neg_data
    )
    
    yield f"data: {json.dumps({'agent': 'System', 'status': 'done', 'message': 'Analysis complete.', 'final_report': final_report.model_dump()})}\n\n"


# --- Endpoint Route ---
# Note: We must read the file into memory here, because the generator cannot safely read the stream asynchronously later.
@router.post("/analyze")
async def analyze_contract(file: UploadFile = File(...)):
    file_bytes = await file.read()
    return StreamingResponse(analyze_contract_stream(file_bytes, file.filename), media_type="text/event-stream")