import asyncio
from app.services.llm_extractor import LLMExtractorService

sample_document = """
GOVERNMENT OF INDIA
Central Reserve Police Force
Notice Inviting Tender (NIT)

Section 4.1: Financial Eligibility
The bidder must demonstrate strong financial stability. The minimum average annual turnover of the bidder during the last three financial years (up to 31st March 2025) should not be less than ₹5,00,00,000 (Rupees Five Crore only).
Note: Audited balance sheets certified by Chartered Accountant must be submitted.

Section 4.2: Experience
Bidders must have experience in executing at least 3 (three) similar works of construction for Government/Semi-Government/PSUs during the last 5 years.

Section 5: Statutory Compliance
Valid GST registration and ISO 9001:2015 certifications are mandatory requirements for eligibility. Failure to provide current certificates will result in automatic disqualification at the technical stage.
"""

async def run_test():
    print("Initializing LLMExtractorService...")
    service = LLMExtractorService()
    
    print("Extracting criteria...")
    try:
        response = await service.extract_criteria_from_text(sample_document)
        print("\n--- EXTRACTION SUCCESS ---")
        print("Tender Title:", response.tender_title)
        print("Issuing Authority:", response.issuing_authority)
        print(f"Extracted {len(response.criteria)} criteria:")
        
        # Write raw output to file
        with open("output.json", "w", encoding="utf-8") as f:
            f.write(response.model_dump_json(indent=2))
        print("Successfully wrote output.json!")
    except Exception as e:
        print(f"\n--- EXTRACTION FAILED ---")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_test())
