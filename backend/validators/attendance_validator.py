from datetime import date
from sqlalchemy.orm import Session
from models import Attendance, Employee

VALID_STATUSES = {"present", "absent"}

def validate_create_attendance(data, db: Session) -> str | None:
    
    if not db.query(Employee).filter(Employee.id == data.employee_id).first():
        return "Employee not found"
    
    if not data.status or (data.status.strip().lower() not in VALID_STATUSES):
        return "Status must be 'Present' or 'Absent'"
    
    if data.date > date.today():
        return "Cannot mark attendance for a future date"
    
    existing = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.date == data.date,
    ).first()
    if existing:
        return "Attendance already marked for this employee on this date"
    
    return None


def validate_update_attendance(data, db: Session) -> str | None:
    
    if data.status is not None and data.status.strip().lower() not in VALID_STATUSES:
        return "Status must be 'Present' or 'Absent'"
    
    return None