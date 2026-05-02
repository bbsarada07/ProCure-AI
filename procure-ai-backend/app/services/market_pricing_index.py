class MarketPricingOracle:
    """
    Mock Service simulating real-time market pricing feeds for materials and labor.
    """
    def __init__(self):
        # Current Market Rates (per unit/hour)
        self.market_index = {
            "Cement (Grade 43)": 450,    # per bag
            "TMT Steel (Fe500)": 65000,  # per tonne
            "Standard Skilled Labor": 850, # per day
            "Excavation Work": 1200      # per cubic meter
        }

    async def get_current_rate(self, item: str) -> float:
        """Fetch live rate from simulated market index"""
        print(f"[ORACLE] Fetching live rate for: {item}")
        return self.market_index.get(item, 0.0)

    async def detect_anomaly(self, item: str, quoted_price: float) -> dict:
        """
        Check if quoted price deviates significantly from market index.
        """
        market_rate = await self.get_current_rate(item)
        if market_rate == 0: return {"anomaly": False}
        
        # Predatory pricing detection: > 50% below market
        if quoted_price < (market_rate * 0.5):
            deviation = ((market_rate - quoted_price) / market_rate) * 100
            return {
                "anomaly": True,
                "type": "Predatory Pricing",
                "market_rate": market_rate,
                "deviation_percent": round(deviation, 2)
            }
            
        return {"anomaly": False}
