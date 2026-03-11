from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Attendance, Employee
from schemas import AttendanceCreate, AttendanceUpdate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("", response_model=list[AttendanceResponse])
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
    return q.order_by(Attendance.date.desc()).all()


@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(attendance_id: int, db: Session = Depends(get_db)):
    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return att


@router.post("", response_model=AttendanceResponse, status_code=201)
def create_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    att = Attendance(
        employee_id=data.employee_id,
        date=data.date,
        status=data.status,
        check_in=data.check_in,
        check_out=data.check_out,
    )
    db.add(att)
    db.commit()
    db.refresh(att)
    return att


@router.patch("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    attendance_id: int, data: AttendanceUpdate, db: Session = Depends(get_db)
):
    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    if data.status is not None:
        att.status = data.status
    if data.check_in is not None:
        att.check_in = data.check_in
    if data.check_out is not None:
        att.check_out = data.check_out
    db.commit()
    db.refresh(att)
    return att


@router.delete("/{attendance_id}", status_code=204)
def delete_attendance(attendance_id: int, db: Session = Depends(get_db)):
    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    db.delete(att)
    db.commit()
    return None
