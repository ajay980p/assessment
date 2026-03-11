import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../ui';
import { formatDateForInput } from '../../utils';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
];

export default function MarkAttendanceForm({ employees, onSubmit, isSubmitting }) {
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [status, setStatus] = useState('present');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = employeeId ? Number(employeeId) : null;
    if (id == null || !date) return;
    try {
      await onSubmit({ employee_id: id, date, status });
      setEmployeeId('');
      setDate(formatDateForInput(new Date()));
      setStatus('present');
    } catch {
      // Keep form values so user sees what they submitted; parent shows error
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Mark Attendance</h2>
      <p className="mt-0.5 text-sm text-gray-500">
        Record daily attendance for individual employees
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-4">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Employee</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} ({emp.department})
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
            <Calendar className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  status === opt.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit Entry'}
        </Button>
      </form>
    </div>
  );
}
