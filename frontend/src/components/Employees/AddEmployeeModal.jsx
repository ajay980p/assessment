import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { X, AlertCircle } from 'lucide-react';
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      department: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onValid = async (data) => {
    try {
      await employeeService.createEmployee({
        full_name: data.fullName.trim(),
        email: data.email.trim(),
        department: data.department,
      });
      handleClose();
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to save';
      const message = Array.isArray(msg) ? msg.join(' ') : msg;
      setError('root', { type: 'manual', message });
    }
  };

  const inputErrorClass = (name) =>
    errors[name]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500';

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="relative w-full max-w-lg rounded-xl bg-white shadow-xl outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      contentLabel="Add New Employee"
      aria={{ labelledby: 'add-employee-title' }}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 id="add-employee-title" className="text-lg font-semibold text-gray-900">
          Add New Employee
        </h2>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onValid)} className="px-6 py-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="employee-id" className="mb-1 block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              id="employee-id"
              type="text"
              value="Auto-generated on save"
              readOnly
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          <div>
            <label htmlFor="full-name" className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              placeholder="Enter full name"
              className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 ${inputErrorClass('fullName')}`}
              {...register('fullName', {
                required: 'Full name is required',
              })}
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
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 ${inputErrorClass('email')}`}
              {...register('email', {
                required: 'Please enter a valid email address',
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Please enter a valid email address',
                },
              })}
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
              Department
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
              {...register('department', {
                required: 'Please select a department',
              })}
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
            {isSubmitting ? 'Saving…' : 'Save Employee'}
          </Button>
        </div>
      </form>
    </ReactModal>
  );
}
