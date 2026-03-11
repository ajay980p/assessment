from pydantic import BaseModel, EmailStr


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
