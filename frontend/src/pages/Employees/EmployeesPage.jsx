import { useState, useCallback } from 'react';
import EmployeePageHeader from '../../components/Employees/EmployeePageHeader.jsx';
import EmployeeTableSkeleton from '../../components/Employees/EmployeeTableSkeleton.jsx';
import EmployeeEmptyState from '../../components/Employees/EmployeeEmptyState.jsx';
import EmployeeTable from '../../components/Employees/EmployeeTable.jsx';
import AddEmployeeModal from '../../components/Employees/AddEmployeeModal.jsx';
import Toast from '../../components/ui/Toast.jsx';
import { useEmployees } from '../../hooks/useEmployees.js';

export default function EmployeesPage() {
  const { employees, loading, error, fetchEmployees, deleteEmployee } = useEmployees();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const isEmpty = !loading && employees.length === 0;

  const handleAddEmployee = useCallback(() => setModalOpen(true), []);
  const handleModalClose = useCallback(() => setModalOpen(false), []);
  const handleModalSuccess = useCallback(() => {
    fetchEmployees();
    setToast({
      show: true,
      title: 'Form updated',
      message: 'Your changes have been saved successfully.',
    });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 5000);
  }, [fetchEmployees]);

  return (
    <div className="space-y-6">
      <EmployeePageHeader onAddEmployee={handleAddEmployee} />

      <AddEmployeeModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
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
        <EmployeeEmptyState onClearFilters={fetchEmployees} />
      ) : (
        <EmployeeTable employees={employees} onDelete={deleteEmployee} />
      )}
    </div>
  );
}
