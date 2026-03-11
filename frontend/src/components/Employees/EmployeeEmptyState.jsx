import { SearchX } from 'lucide-react';

export default function EmployeeEmptyState({ onClearFilters }) {
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
