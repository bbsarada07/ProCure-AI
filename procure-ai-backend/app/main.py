from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
import asyncio
import json
from typing import Dict, List
import uuid

app = FastAPI(
    title="Statutory DNA Ledger Backend",
    description="End-to-end Logic-Gate DNA system for CRPF tender verification",
    version="1.0.0",
)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.core.state import jobs, JobStatus
from app.services.evaluation_worker import run_evaluation_worker

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

from app.api.endpoints import webhooks
app.include_router(api_router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Statutory DNA Ledger"}
