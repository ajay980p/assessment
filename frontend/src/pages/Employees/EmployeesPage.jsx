import { useState, useCallback } from 'react';
import EmployeePageHeader from '../../components/Employees/EmployeePageHeader.jsx';
import EmployeeTableSkeleton from '../../components/Employees/EmployeeTableSkeleton.jsx';
import EmployeeEmptyState from '../../components/Employees/EmployeeEmptyState.jsx';
import EmployeeTable from '../../components/Employees/EmployeeTable.jsx';
import AddEditEmployeeModal from '../../components/Employees/AddEditEmployeeModal.jsx';
import DeleteEmployeeModal from '../../components/Employees/DeleteEmployeeModal.jsx';
import Toast from '../../components/ui/Toast.jsx';
import { useEmployees } from '../../hooks/useEmployees.js';

export default function EmployeesPage() {
  const { employees, loading, error, deleteEmployee, invalidateEmployees } = useEmployees();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const isEmpty = !loading && employees.length === 0;

  const handleAddEmployee = useCallback(() => {
    setEditingEmployee(null);
    setModalOpen(true);
  }, []);
  const handleEditEmployee = useCallback((emp) => {
    setEditingEmployee(emp);
    setModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingEmployee(null);
  }, []);
  const handleModalSuccess = useCallback(() => {
    invalidateEmployees();
    setToast({
      show: true,
      title: 'Form updated',
      message: 'Your changes have been saved successfully.',
    });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 5000);
  }, [invalidateEmployees]);

  const handleDeleteClick = useCallback((emp) => setEmployeeToDelete(emp), []);
  const handleDeleteModalClose = useCallback(() => setEmployeeToDelete(null), []);
  const handleDeleteConfirm = useCallback(
    async (employeeId) => {
      await deleteEmployee(employeeId);
      setEmployeeToDelete(null);
    },
    [deleteEmployee]
  );

  return (
    <div className="space-y-6">
      <EmployeePageHeader onAddEmployee={handleAddEmployee} />

      <AddEditEmployeeModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        employee={editingEmployee}
      />

      <DeleteEmployeeModal
        isOpen={!!employeeToDelete}
        onClose={handleDeleteModalClose}
        employee={employeeToDelete}
        onConfirm={handleDeleteConfirm}
      />

      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onDismiss={() => setToast((p) => ({ ...p, show: false }))}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <EmployeeTableSkeleton />
      ) : isEmpty ? (
        <EmployeeEmptyState onClearFilters={invalidateEmployees} />
      ) : (
        <EmployeeTable employees={employees} onEdit={handleEditEmployee} onDelete={handleDeleteClick} />
      )}
    </div>
  );
}
