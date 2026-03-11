"""API routers. Register all routers via get_routers()."""
from routers import employees, attendance, dashboard

ROUTERS = [
    employees.router,
    attendance.router,
    dashboard.router,
]


def get_routers():
    return ROUTERS


__all__ = ["ROUTERS", "get_routers", "employees", "attendance", "dashboard"]
