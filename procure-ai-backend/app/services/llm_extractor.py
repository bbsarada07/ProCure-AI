import os
import json
from google import genai
from google.genai import types
from google.genai import errors
from dotenv import load_dotenv
from app.models.schemas import TenderExtractionResponse

load_dotenv()

MOCK_RESPONSE = {
    "tender_id": "CRPF-CONST-2026-001",
    "tender_title": "Construction of Additional Barracks for CRPF Battalion Headquarters",
    "issuing_authority": "Central Reserve Police Force (CRPF), Ministry of Home Affairs",
    "criteria": [
        {
            "criterion_id": "FIN-01",
            "category": "financial",
            "description": "Average Annual Financial Turnover of the bidder during the last 3 years ending 31st March of the previous financial year should be at least INR 5 Crore.",
            "priority": "mandatory",
            "verification_type": "numeric",
            "threshold_value": {
                "amount": 50000000.0,
                "currency": "INR"
            },
            "acceptable_evidence": ["Audited Balance Sheet", "Chartered Accountant Certificate"],
            "evaluation_logic": "extracted_value >= threshold_value",
            "source_reference": {
                "page": 5,
                "section": "Section II - Financial Requirements",
                "line_numbers": [12, 13]
            }
        },
        {
            "criterion_id": "TECH-01",
            "category": "technical",
            "description": "Bidder must have successfully completed similar works (construction of multi-story institutional buildings) during last 7 years.",
            "priority": "mandatory",
            "verification_type": "document_check",
            "threshold_value": None,
            "acceptable_evidence": ["Work Completion Certificate", "Client Handover Document"],
            "evaluation_logic": "evidence_provided == true",
            "source_reference": {
                "page": 7,
                "section": "Section III - Technical Experience",
                "line_numbers": [21, 22]
            }
        },
        {
            "criterion_id": "COMP-01",
            "category": "compliance",
            "description": "Valid EPF and ESI registration numbers must be provided.",
            "priority": "mandatory",
            "verification_type": "document_check",
            "threshold_value": None,
            "acceptable_evidence": ["EPF Registration Certificate", "ESI Registration Certificate"],
            "evaluation_logic": "evidence_provided == true",
            "source_reference": {
                "page": 10,
                "section": "Section IV - Statutory Compliances",
                "line_numbers": [4, 5]
            }
        }
    ],
    "ambiguities_flagged": [
        "The definition of 'similar works' specifies multi-story institutional buildings, but does not state the minimum number of stories required."
    ]
}

class LLMExtractorService:
    def __init__(self):
        # The genai.Client automatically picks up GEMINI_API_KEY from environment
        self.client = genai.Client()
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        self.temperature = float(os.getenv("GEMINI_TEMPERATURE", "0.1"))
        self.use_mock_llm = os.getenv("USE_MOCK_LLM", "false").lower() == "true"

    async def extract_criteria_from_text(self, document_text: str) -> TenderExtractionResponse:
        """
        Implementation of Phase 1.2: Intelligent Criterion Extraction using Gemini Structured Outputs.
        Includes a resilient mock fallback system.
        """
        
        if self.use_mock_llm:
            print("WARNING: USE_MOCK_LLM is true. Falling back to mock data.")
            return TenderExtractionResponse(**MOCK_RESPONSE)

        prompt = f"""
        You are an expert procurement and tender evaluation AI system.
        Your task is to analyze the following tender document text and extract structured eligibility criteria.
        
        Instructions:
        1. Identify sections relating to financial eligibility, technical experience, and compliance/documentation.
        2. Deconstruct complex compound criteria (e.g., ISO 9001 AND 14001 are separate criteria) if possible, or represent them logically.
        3. Extract normalized values for thresholds (e.g., ₹5 crore -> 50000000 INR).
        4. Detect vague or ambiguous language and summarize them in 'ambiguities_flagged'.
        5. Provide a source reference mapping to the section and approximate page if identifiable.
        
        Tender Document Text:
        ---
        {document_text}
        ---
        """
        
        print(f"Calling {self.model} for structured extraction...")
        
        try:
            # Use structured generation to ensure parsing into Pydantic schema
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=TenderExtractionResponse,
                    temperature=self.temperature,
                ),
            )
            
            # Parse the JSON string output to our Pydantic model
            result_dict = json.loads(response.text)
            return TenderExtractionResponse(**result_dict)
            
        except errors.APIError as e:
            if e.code == 429 or "429" in str(e) or "quota" in str(e).lower() or "exhausted" in str(e).lower():
                print(f"WARNING: API Quota Exceeded or API Error (Code: {e.code}): Falling back to mock data")
                return TenderExtractionResponse(**MOCK_RESPONSE)
            raise e
        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower() or "exhausted" in str(e).lower():
                print(f"WARNING: API Quota Exceeded (Exception): Falling back to mock data")
                return TenderExtractionResponse(**MOCK_RESPONSE)
            raise e
