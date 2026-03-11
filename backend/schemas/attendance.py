from datetime import date, datetime
from pydantic import BaseModel


class AttendanceBase(BaseModel):
    date: date
    status: str


class AttendanceCreate(AttendanceBase):
    employee_id: int


class AttendanceUpdate(BaseModel):
    status: str | None = None
    check_in: datetime | None = None
    check_out: datetime | None = None


class AttendanceResponse(AttendanceBase):
    id: int
    employee_id: int

    model_config = {"from_attributes": True}
