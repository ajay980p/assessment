from sqlalchemy import Column, Integer, ForeignKey, Date, String, UniqueConstraint
from sqlalchemy.orm import relationship
from config.database import Base

from models.employee import Employee


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("employee_id", "date", name="uq_attendance_employee_date"),)

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(32), nullable=False)  # present, absent, leave

    employee = relationship("Employee", back_populates="attendance_records")
