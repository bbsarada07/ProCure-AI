import asyncio
from app.core.state import jobs, JobStatus
from app.services.external_gov_api import ExternalGovService
from app.services.market_pricing_index import MarketPricingOracle
import uuid

async def run_evaluation_worker(job_id: str, bidder_name: str, manager: any, language: str = "EN"):
    """
    Enhanced background worker with Real-Time External Data Validation.
    """
    jobs[job_id]["status"] = JobStatus.PROCESSING
    gov_api = ExternalGovService()
    pricing_oracle = MarketPricingOracle()
    
    criteria = [
        {"id": "crit_1", "name": "GSTN Status"},
        {"id": "crit_2", "name": "Market Price Audit"},
        {"id": "crit_3", "name": "Technical Experience"}
    ]
    
    for crit in criteria:
        await asyncio.sleep(2) # Simulated extraction
        
        status = "Pass"
        extra_data = {}
        
        # Real-Time Integration Logic
        if crit["id"] == "crit_1":
            # Simulate GSTN check
            mock_gstn = "07BBBBB1111B1Z2" if bidder_name == "Bharat Steel Works" else "27AAAAA0000A1Z5"
            gov_result = await gov_api.verify_gstn(mock_gstn)
            
            if gov_result["status"] == "Suspended":
                status = "Fail"
                extra_data = {"live_alert": "Critical Fraud: Live API Status Mismatch", "api": "GSTN Portal"}
            else:
                extra_data = {"live_verified": True, "api": "GSTN Portal"}
                
        elif crit["id"] == "crit_2":
            # Simulate Market Pricing Audit
            quoted_price = 45.0 if bidder_name == "Apex Infrastructure Pvt Ltd" else 450.0
            anomaly = await pricing_oracle.detect_anomaly("Cement (Grade 43)", quoted_price)
            
            if anomaly["anomaly"]:
                status = "Fail"
                extra_data = {
                    "anomaly_type": "Predatory Pricing",
                    "deviation": f"{anomaly['deviation_percent']}% below market index"
                }
        
        update = {
            "type": "EVALUATION_UPDATE",
            "job_id": job_id,
            "bidder_name": bidder_name,
            "criterion": crit["name"],
            "status": status,
            "extra_data": extra_data,
            "timestamp": str(asyncio.get_event_loop().time())
        }
        await manager.broadcast_job_update(job_id, update)
    
    jobs[job_id]["status"] = JobStatus.COMPLETED
    await manager.broadcast_job_update(job_id, {"type": "JOB_COMPLETED", "job_id": job_id})
