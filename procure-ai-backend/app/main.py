from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from typing import Dict, List
import uuid

# Router Imports
from app.api import router as api_router
from app.api.endpoints import webhooks
from app.api.v2 import saas_analyzer
from app.core.state import jobs, JobStatus
from app.services.evaluation_worker import run_evaluation_worker

app = FastAPI(
    title="SaaS Contract Analyzer & DNA Ledger",
    description="End-to-end AI system for contract parsing and tender verification",
    version="2.0.0",
)

# 🚨 CRITICAL CORS FIX FOR STREAMING (SSE)
# When allow_credentials=True, you cannot use ["*"] in strict environments.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"] # Crucial for exposing streaming headers to the frontend
)

# --- WEBSOCKET CONNECTION MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, job_id: str):
        await websocket.accept()
        if job_id not in self.active_connections:
            self.active_connections[job_id] = []
        self.active_connections[job_id].append(websocket)

    def disconnect(self, websocket: WebSocket, job_id: str):
        if job_id in self.active_connections:
            self.active_connections[job_id].remove(websocket)

    async def broadcast_job_update(self, job_id: str, message: dict):
        if job_id in self.active_connections:
            for connection in self.active_connections[job_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

    async def broadcast_global_update(self, message: dict):
        """Broadcasts to all active WebSocket connections across all jobs."""
        for connections in self.active_connections.values():
            for connection in connections:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

@app.websocket("/ws/dna-verification/{job_id}")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    await manager.connect(websocket, job_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, job_id)


# --- ROUTER INCLUSIONS ---
app.include_router(api_router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])

# Your new Multi-Agent SaaS Engine Route
app.include_router(saas_analyzer.router, prefix="/api/v2/saas-analyzer", tags=["SaaS Analyzer"])


# --- HEALTH CHECK ---
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Backend Online"}
    