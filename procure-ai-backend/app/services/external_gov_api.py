import random

class ExternalGovService:
    """
    Mock Service simulating real-time connection to Indian Gov Databases.
    """
    def __init__(self):
        # Simulation of "Ground Truth" data
        self.gstn_db = {
            "27AAAAA0000A1Z5": {"status": "Active", "company": "Apex Infrastructure Pvt Ltd", "registration_date": "2015-04-12"},
            "07BBBBB1111B1Z2": {"status": "Suspended", "company": "Bharat Steel Works", "registration_date": "2010-09-20"},
            "19CCCCC2222C1Z9": {"status": "Active", "company": "Coastal Marine Logistics", "registration_date": "2018-01-05"},
            "33DDDDD3333D1Z1": {"status": "Active", "company": "Dynamic Engineering Solutions", "registration_date": "2021-11-30"}
        }
        
        self.mca_db = {
            "L12345DL2015PTC288123": {"filing_status": "Up-to-date", "directors": ["A. Sharma", "R. Gupta"]},
            "L98765MH2010PLC098765": {"filing_status": "Defaulted", "directors": ["V. Patel", "M. Singh"]}
        }

    async def verify_gstn(self, gstn: str) -> dict:
        """Mock call to GSTN Portal API"""
        print(f"[EXT-API] Querying GSTN Portal for: {gstn}")
        return self.gstn_db.get(gstn, {"status": "Not Found", "company": "Unknown"})

    async def verify_cin(self, cin: str) -> dict:
        """Mock call to MCA21 Database"""
        print(f"[EXT-API] Querying MCA21 for CIN: {cin}")
        return self.mca_db.get(cin, {"filing_status": "Unknown"})
