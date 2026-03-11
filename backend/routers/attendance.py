from datetime import date
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from config.database import get_db
from models import Attendance, Employee
from schemas import AttendanceCreate, AttendanceUpdate, AttendanceResponse
from utils import success_response, error_response
from validators import validate_create_attendance, validate_update_attendance

router = APIRouter(prefix="/attendance", tags=["attendance"])

DEFAULT_PAGE = 1
DEFAULT_LIMIT = 10
MAX_LIMIT = 100


def _to_response(att: Attendance) -> dict:
    return AttendanceResponse.model_validate(att).model_dump()


@router.get("")
def list_attendance(
    employee_id: int | None = Query(None),
    from_date: date | None = Query(None, alias="from"),
    to_date: date | None = Query(None, alias="to"),
    department: str | None = Query(None),
    status: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(DEFAULT_PAGE, ge=1),
    limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT),
    db: Session = Depends(get_db),
):
    today = date.today()
    if from_date is not None and from_date > today:
        return JSONResponse(
            content=error_response("From date cannot be in the future"),
            status_code=400,
        )
    if to_date is not None and to_date > today:
        return JSONResponse(
            content=error_response("To date cannot be in the future"),
            status_code=400,
        )
    if from_date is not None and to_date is not None and from_date > to_date:
        return JSONResponse(
            content=error_response("From date must be before or equal to to date"),
            status_code=400,
        )
    if status is not None and status.strip():
        status_lower = status.strip().lower()
        if status_lower not in ("present", "absent"):
            return JSONResponse(
                content=error_response("Status must be 'present' or 'absent'"),
                status_code=400,
            )
    q = db.query(Attendance).join(Employee, Attendance.employee_id == Employee.id)
    if employee_id is not None:
        q = q.filter(Attendance.employee_id == employee_id)
    if from_date is not None:
        q = q.filter(Attendance.date >= from_date)
    if to_date is not None:
        q = q.filter(Attendance.date <= to_date)
    if department and department.strip():
        q = q.filter(Employee.department == department.strip())
    if status and status.strip():
        q = q.filter(Attendance.status.ilike(status.strip()))
    if search and search.strip():
        term = f"%{search.strip()}%"
        q = q.filter(
            (Employee.full_name.ilike(term)) | (Employee.department.ilike(term))
        )
    total = q.with_entities(func.count(Attendance.id)).scalar() or 0
    offset = (page - 1) * limit
    records = q.order_by(Attendance.date.desc()).offset(offset).limit(limit).all()
    data = [_to_response(att) for att in records]
    return success_response("Attendance retrieved", {"items": data, "total": total})


@router.get("/stats")
def attendance_stats(
    date_param: date | None = Query(None, alias="date"),
    db: Session = Depends(get_db),
):
    """Returns total_employees and marked_count for the given date (default today)."""
    target = date_param if date_param is not None else date.today()
    total_employees = db.query(Employee).count()
    marked_count = (
        db.query(func.count(func.distinct(Attendance.employee_id)))
        .filter(Attendance.date == target)
        .scalar()
        or 0
    )
    return success_response(
        "Stats retrieved",
        {"date": str(target), "total_employees": total_employees, "marked_count": marked_count},
    )


@router.get("/{attendance_id}")
def get_attendance(attendance_id: int, db: Session = Depends(get_db)):
    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        return JSONResponse(
            content=error_response("Attendance record not found"),
            status_code=404,
        )
    return success_response("Attendance record retrieved", _to_response(att))


def _normalize_status(status: str) -> str:
    return status.strip().lower().capitalize() if status else status


@router.post("", status_code=201)
def create_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    err = validate_create_attendance(data, db)
    if err:
        return JSONResponse(content=error_response(err), status_code=400)
    status = _normalize_status(data.status)
    att = Attendance(
        employee_id=data.employee_id,
        date=data.date,
        status=status,
    )
    try:
        db.add(att)
        db.commit()
        db.refresh(att)
    except IntegrityError:
        db.rollback()
        return JSONResponse(
            content=error_response("Attendance already marked for this employee on this date"),
            status_code=400,
        )
    return success_response("Attendance record created", _to_response(att))


@router.patch("/{attendance_id}")
def update_attendance(
    attendance_id: int, data: AttendanceUpdate, db: Session = Depends(get_db)
):
    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        return JSONResponse(
            content=error_response("Attendance record not found"),
            status_code=404,
        )
    err = validate_update_attendance(data, db)
    if err:
        return JSONResponse(content=error_response(err), status_code=400)
    if data.status is not None:
        att.status = _normalize_status(data.status)
    db.commit()
    db.refresh(att)
    return success_response("Attendance record updated", _to_response(att))


@router.delete("/{attendance_id}")
def delete_attendance(attendance_id: int, db: Session = Depends(get_db)):
    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        return JSONResponse(
            content=error_response("Attendance record not found"),
            status_code=404,
        )
    db.delete(att)
    db.commit()
    return success_response("Attendance record deleted", None)
