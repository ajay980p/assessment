import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

/**
 * Confirmation modal for deleting an employee.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {{ employee_id: string, full_name: string, email: string, department: string } | null} employee
 * @param {(employeeId: string) => Promise<void>} onConfirm
 */
export default function DeleteEmployeeModal({ isOpen, onClose, employee, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) setError(null);
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!employee) return;
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(employee.employee_id);
      onClose?.();
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.detail ??
        err.message ??
        'Could not delete employee. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Could not delete employee. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Employee">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete <strong>{employee.full_name}</strong>? This action cannot
        be undone.
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={handleConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}
