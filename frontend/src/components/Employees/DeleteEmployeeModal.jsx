import { useState } from 'react';
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

  const handleConfirm = async () => {
    if (!employee) return;
    setIsDeleting(true);
    try {
      await onConfirm(employee.employee_id);
      onClose?.();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Employee">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete <strong>{employee.full_name}</strong>? This action cannot be
        undone.
      </p>
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
