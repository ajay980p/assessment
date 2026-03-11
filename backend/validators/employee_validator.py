import re
from sqlalchemy.orm import Session
from models import Employee

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

def validate_create_employee(data, db: Session) -> str | None:
    """Returns error message string, or None if valid"""
    
    if not data.full_name or not data.full_name.strip():
        return "Full name is required"
    
    if not data.email or not data.email.strip():
        return "Email is required"
    
    if not data.department or not data.department.strip():
        return "Department is required"
    
    if not EMAIL_REGEX.match(data.email):
        return "Invalid email format"
    
    email_normalized = data.email.strip().lower()
    if db.query(Employee).filter(Employee.email == email_normalized).first():
        return "Email already registered"
    
    return None


def validate_update_employee(data, employee_id: str, db: Session) -> str | None:
    
    if data.full_name is not None and not data.full_name.strip():
        return "Full name cannot be empty"
    
    if data.department is not None and not data.department.strip():
        return "Department cannot be empty"
    
    if data.email is not None:
        if not EMAIL_REGEX.match(data.email):
            return "Invalid email format"
        email_normalized = data.email.strip().lower()
        existing = db.query(Employee).filter(Employee.email == email_normalized).first()
        if existing and existing.employee_id != employee_id:
            return "Email already registered"
    
    return None