from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict, Any

class ThresholdValue(BaseModel):
    amount: float
    currency: Optional[str] = "INR"

class SourceReference(BaseModel):
    page: int
    section: str
    line_numbers: List[int]

class Criterion(BaseModel):
    criterion_id: str = Field(..., description="Unique ID for the criterion")
    category: str = Field(..., description="financial|technical|compliance|documentation")
    description: str = Field(..., description="Human-readable description")
    priority: str = Field("mandatory", description="mandatory|desirable")
    verification_type: str = Field("numeric", description="numeric|boolean|document_check|date_range")
    threshold_value: Optional[ThresholdValue] = None
    acceptable_evidence: List[str] = Field(default_factory=list)
    evaluation_logic: str = Field(..., description="Logic to evaluate, e.g. extracted_value >= threshold_value")
    source_reference: Optional[SourceReference] = None

class TenderExtractionResponse(BaseModel):
    tender_id: str
    tender_title: str
    issuing_authority: str
    criteria: List[Criterion]
    ambiguities_flagged: List[str] = Field(default_factory=list)
