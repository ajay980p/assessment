from datetime import date
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from config.database import get_db
from models import Attendance, Employee
from schemas import AttendanceCreate, AttendanceUpdate, AttendanceResponse
from utils.response import success_response, error_response
from validators.attendance_validator import validate_create_attendance, validate_update_attendance

router = APIRouter(prefix="/attendance", tags=["attendance"])


def _to_response(att: Attendance) -> dict:
    return AttendanceResponse.model_validate(att).model_dump()


@router.get("")
def list_attendance(
    employee_id: int | None = Query(None),
    from_date: date | None = Query(None, alias="from"),
    to_date: date | None = Query(None, alias="to"),
    db: Session = Depends(get_db),
):
    q = db.query(Attendance)
    if employee_id is not None:
        q = q.filter(Attendance.employee_id == employee_id)
    if from_date is not None:
        q = q.filter(Attendance.date >= from_date)
    if to_date is not None:
        q = q.filter(Attendance.date <= to_date)
    records = q.order_by(Attendance.date.desc()).all()
    data = [_to_response(att) for att in records]
    return success_response("Attendance retrieved", data)


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
    db.add(att)
    db.commit()
    db.refresh(att)
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
