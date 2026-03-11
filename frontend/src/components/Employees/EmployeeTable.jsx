import { Trash2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import EmployeeAvatar from './EmployeeAvatar.jsx';

export default function EmployeeTable({ employees, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Employee ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Department
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.employee_id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{emp.employee_id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar name={emp.full_name} />
                    <span className="text-sm font-medium text-gray-900">
                      {emp.full_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                <td className="px-6 py-4">
                  <Badge>{emp.department}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(emp.employee_id)}
                    className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${emp.full_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
