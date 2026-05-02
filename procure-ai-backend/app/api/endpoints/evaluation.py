from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks
from typing import Dict, Any, List
import uuid
from app.core.state import jobs, JobStatus
from app.services.evaluation_worker import run_evaluation_worker

router = APIRouter()

@router.post("/execute-logic-gate")
async def execute_logic_gate(
    background_tasks: BackgroundTasks,
    bidder_name: str = Form(...),
    tender_id: str = Form(...),
    bidder_documents: List[UploadFile] = File(...),
    language: str = Form("EN"),
):
    """
    Asynchronous job trigger for zero-trust logic-gate execution.
    """
    job_id = str(uuid.uuid4())
    
    # Initialize job state
    jobs[job_id] = {
        "job_id": job_id,
        "bidder_name": bidder_name,
        "tender_id": tender_id,
        "status": JobStatus.PENDING,
        "progress": 0
    }
    
    # Trigger background worker
    from app.main import manager
    background_tasks.add_task(run_evaluation_worker, job_id, bidder_name, manager, language)
    
    return {
        "job_id": job_id,
        "status": JobStatus.PENDING,
        "message": "DNA verification logic-gate execution queued successfully."
    }

@router.get("/job/{job_id}")
async def get_job_status(job_id: str):
    return jobs.get(job_id, {"error": "Job not found"})
