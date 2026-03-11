from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from config.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(32), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    department = Column(String(128), nullable=False)

    attendance_records = relationship("Attendance", back_populates="employee")


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("employee_id", "date", name="uq_attendance_employee_date"),)

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(32), nullable=False)  # e.g. present, absent, leave

    employee = relationship("Employee", back_populates="attendance_records")
