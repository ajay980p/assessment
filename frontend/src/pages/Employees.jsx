import { useState } from 'react';
import { Plus, Trash2, SearchX } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

const MOCK_EMPLOYEES = [
  {
    id: 'EMP-2041',
    fullName: 'Johnathan Doe',
    email: 'john.doe@hrmslite.com',
    department: 'Engineering',
  },
  {
    id: 'EMP-2045',
    fullName: 'Alice Smith',
    email: 'alice.s@hrmslite.com',
    department: 'Product Design',
  },
];

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
      {initials}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
          <div className="ml-auto h-8 w-8 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 py-16 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-400">
        <SearchX className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900">No employees found</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        We couldn&apos;t find any employees matching your current filters or in your organization.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const displayList = showEmpty ? [] : employees;
  const isEmpty = displayList.length === 0 && !loading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500">Manage your organization&apos;s workforce.</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          className="mt-2 sm:mt-0"
        >
          Add Employee
        </Button>
      </div>

      {loading ? (
        <>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Loading state preview
          </p>
          <TableSkeleton />
        </>
      ) : isEmpty ? (
        <>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Empty state preview
          </p>
          <EmptyState onClearFilters={() => setShowEmpty(false)} />
        </>
      ) : (
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
                {displayList.map((emp) => (
                  <tr key={emp.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{emp.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.fullName} />
                        <span className="text-sm font-medium text-gray-900">
                          {emp.fullName}
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
                        onClick={() => handleDelete(emp.id)}
                        className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${emp.fullName}`}
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
      )}

      <div className="flex gap-2 border-t border-gray-200 pt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setLoading(!loading)}
        >
          {loading ? 'Hide loading' : 'Show loading state'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowEmpty(!showEmpty)}
        >
          {showEmpty ? 'Show data' : 'Show empty state'}
        </Button>
      </div>
    </div>
  );
}
