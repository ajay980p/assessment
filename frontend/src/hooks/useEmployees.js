import { useState, useEffect, useCallback } from 'react';
import * as employeeService from '../services/employeeService.js';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const deleteEmployee = useCallback(async (employeeId) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await employeeService.deleteEmployee(employeeId);
      setEmployees((prev) => prev.filter((e) => e.employee_id !== employeeId));
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete');
    }
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    deleteEmployee,
  };
}
