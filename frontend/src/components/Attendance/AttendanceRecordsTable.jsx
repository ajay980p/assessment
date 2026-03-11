import { Pencil } from 'lucide-react';
import EmployeeAvatar from '../Employees/EmployeeAvatar.jsx';

const PAGE_SIZE = 4;

export default function AttendanceRecordsTable({
  records,
  onEdit,
  page,
  total,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginated = records.slice(start, start + PAGE_SIZE);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Employee Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar name={r.employee_name} />
                      <span className="text-sm font-medium text-gray-900">{r.employee_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(r.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status?.toLowerCase() === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(r)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        aria-label={`Edit ${r.employee_name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-6 py-3">
          <p className="text-sm text-gray-600">
            Showing {start + 1} to {Math.min(start + PAGE_SIZE, total)} of {total} entries
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
