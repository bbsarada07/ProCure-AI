from fastapi import APIRouter, Request, BackgroundTasks
from app.core.state import jobs, JobStatus
from app.services.evaluation_worker import run_evaluation_worker
import uuid
import asyncio

router = APIRouter()

@router.post("/cppp-sync")
async def cppp_sync_webhook(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Live Webhook endpoint for CPPP (Central Public Procurement Portal) synchronization.
    Simulates real-time ingestion of a new bid submission.
    """
    payload = await request.json()
    bidder_name = payload.get("bidder_name", "Unknown Bidder")
    tender_id = payload.get("tender_id", "TENDER_DEFAULT")
    
    # Trigger the same async pipeline used for manual uploads
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "job_id": job_id,
        "bidder_name": bidder_name,
        "tender_id": tender_id,
        "status": JobStatus.PENDING,
        "source": "CPPP Webhook"
    }
    
    from app.main import manager
    background_tasks.add_task(run_evaluation_worker, job_id, bidder_name, manager)
    
    # Broadcast to all connected clients that a new bid has arrived via sync
    await manager.broadcast_global_update({
        "type": "LIVE_SYNC_BID_RECEIVED",
        "bidder_name": bidder_name,
        "job_id": job_id
    })
    
    return {
        "status": "success",
        "message": f"Bid for {bidder_name} received via CPPP Sync. Processing job {job_id} initiated.",
        "job_id": job_id
    }
