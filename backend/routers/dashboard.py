from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from config.database import get_db
from models import Employee, Attendance
from utils.response import success_response

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Returns aggregated stats for the dashboard: total employees, today's present/absent/pending."""
    today = date.today()
    total_employees = db.query(Employee).count()

    today_present = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status.ilike("present"))
        .scalar()
        or 0
    )
    today_absent = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status.ilike("absent"))
        .scalar()
        or 0
    )
    today_marked = (
        db.query(func.count(func.distinct(Attendance.employee_id)))
        .filter(Attendance.date == today)
        .scalar()
        or 0
    )
    today_pending = max(0, total_employees - today_marked)

    data = {
        "total_employees": total_employees,
        "today_present": today_present,
        "today_absent": today_absent,
        "today_pending": today_pending,
    }
    return success_response("Dashboard stats retrieved", data)
