from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityLogCreate(BaseModel):
    student_id: str
    module_id: str
    action_type: str
    watch_time_seconds: Optional[int] = 0
    score: Optional[float] = None

class RevenueReport(BaseModel):
    instructor_id: str
    total_sales: int
    gross_revenue: float
    net_revenue: float # Platform kesintisi sonrası
    currency: str = "TRY"
