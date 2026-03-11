from datetime import date, datetime
from pydantic import BaseModel, EmailStr


# ----- Employee -----
class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    department: str | None = None


class EmployeeResponse(EmployeeBase):
    id: int
    employee_id: str

    model_config = {"from_attributes": True}


# ----- Attendance -----
class AttendanceBase(BaseModel):
    date: date
    status: str
    check_in: datetime | None = None
    check_out: datetime | None = None


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
