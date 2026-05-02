from typing import Dict
import asyncio
import uuid

# Global state for simulation
jobs: Dict[str, dict] = {}

class JobStatus:
    PENDING = "Pending"
    PROCESSING = "Processing"
    COMPLETED = "Completed"
    FAILED = "Failed"
