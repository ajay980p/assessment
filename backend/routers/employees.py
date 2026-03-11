from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from config.database import get_db
from models import Employee, Attendance
from schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from utils.response import success_response, error_response

router = APIRouter(prefix="/employees", tags=["employees"])


def _next_employee_id(db: Session) -> str:
    last = db.query(Employee).order_by(Employee.id.desc()).first()
    n = (last.id + 1) if last else 1
    return f"EMP-{2000 + n}"


def _to_response(emp: Employee) -> dict:
    return EmployeeResponse.model_validate(emp).model_dump()


@router.get("")
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    data = [_to_response(e) for e in employees]
    return success_response("Employees retrieved", data)


@router.get("/{employee_id}")
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        return JSONResponse(
            content=error_response("Employee not found"),
            status_code=404,
        )
    return success_response("Employee retrieved", _to_response(emp))


@router.post("", status_code=201)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    if db.query(Employee).filter(Employee.email == data.email).first():
        return JSONResponse(
            content=error_response("Email already registered"),
            status_code=400,
        )
    emp = Employee(
        employee_id=_next_employee_id(db),
        full_name=data.full_name,
        email=data.email,
        department=data.department,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return success_response("Employee created", _to_response(emp))


@router.patch("/{employee_id}")
def update_employee(employee_id: str, data: EmployeeUpdate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        return JSONResponse(
            content=error_response("Employee not found"),
            status_code=404,
        )
    if data.full_name is not None:
        emp.full_name = data.full_name
    if data.email is not None:
        emp.email = data.email
    if data.department is not None:
        emp.department = data.department
    db.commit()
    db.refresh(emp)
    return success_response("Employee updated", _to_response(emp))


@router.delete("/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not emp:
        return JSONResponse(
            content=error_response("Employee not found"),
            status_code=404,
        )
    try:
        db.query(Attendance).filter(Attendance.employee_id == emp.id).delete()
        db.delete(emp)
        db.commit()
        return success_response("Employee deleted successfully", None)
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()  # ← Yeh poora error dikhayega
        return JSONResponse(
            content=error_response(f"Error: {str(e)}"),  # ← Error message response mein bhi dikhao
            status_code=500,
        )