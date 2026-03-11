import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import * as employeeService from '../../services/employeeService.js';

const DEPARTMENTS = [
  'Engineering',
  'Product Design',
  'HR',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
];

const employeeFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .trim()
    .min(1, 'Full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .max(254, 'Email address is too long')
    .refine((v) => !/\s/.test(v), 'Email must not contain spaces')
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
      'Please enter a valid email address (e.g. name@company.com)'
    ),
  department: z
    .string()
    .min(1, 'Please select a department')
    .refine((v) => DEPARTMENTS.includes(v), { message: 'Please select a valid department' }),
});

const defaultValues = { fullName: '', email: '', department: '' };

/**
 * Common modal for Add and Edit employee.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {() => void} onSuccess
 * @param {{ id: number, employee_id: string, full_name: string, email: string, department: string } | null} [employee] - When set, modal is in edit mode.
 */
export default function AddEditEmployeeModal({ isOpen, onClose, onSuccess, employee = null }) {
  const isEdit = Boolean(employee);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(employeeFormSchema),
  });

  const handleClose = () => {
    reset(defaultValues);
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) return;
    if (employee) {
      reset({
        fullName: employee.full_name,
        email: employee.email,
        department: employee.department,
      });
    } else {
      reset(defaultValues);
    }
  }, [isOpen, employee, reset]);

  const onValid = async (data) => {
    try {
      if (isEdit) {
        await employeeService.updateEmployee(employee.employee_id, {
          full_name: data.fullName.trim(),
          email: data.email.trim(),
          department: data.department,
        });
      } else {
        await employeeService.createEmployee({
          full_name: data.fullName.trim(),
          email: data.email.trim(),
          department: data.department,
        });
      }
      handleClose();
      onSuccess?.();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to save';
      const message = Array.isArray(msg) ? msg.join(' ') : msg;
      setError('root', { type: 'manual', message });
    }
  };

  const inputErrorClass = (name) =>
    errors[name]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500';

  const title = isEdit ? 'Edit Employee' : 'Add New Employee';
  const submitLabel = isSubmitting ? 'Saving…' : isEdit ? 'Update Employee' : 'Save Employee';
  const employeeIdDisplay = isEdit ? `#${employee.employee_id}` : 'Auto-generated on save';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit(onValid)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="employee-id" className="mb-1 block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              id="employee-id"
              type="text"
              value={employeeIdDisplay}
              readOnly
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          <div>
            <label htmlFor="full-name" className="mb-1 block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="full-name"
              type="text"
              placeholder="Enter full name"
              className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 ${inputErrorClass('fullName')}`}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 ${inputErrorClass('email')}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="mb-1 block text-sm font-medium text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm ${inputErrorClass('department')}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem',
              }}
              {...register('department')}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.department.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.root.message}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-gray-200 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
