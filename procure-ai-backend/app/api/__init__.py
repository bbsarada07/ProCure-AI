from fastapi import APIRouter
from app.api.endpoints import extraction, evaluation

router = APIRouter()

@router.get("/")
async def api_root():
    return {
        "status": "active",
        "version": "v1",
        "modules": ["dna-compiler", "logic-gate"]
    }

router.include_router(extraction.router, prefix="/dna-compiler", tags=["DNA Compiler"])
router.include_router(evaluation.router, prefix="/logic-gate", tags=["Logic-Gate Execution"])
