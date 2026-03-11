import { Plus } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function EmployeePageHeader({ onAddEmployee } = {}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="text-sm text-gray-500">Manage your organization&apos;s workforce.</p>
      </div>
      <Button
        leftIcon={<Plus className="h-4 w-4" />}
        className="mt-2 sm:mt-0"
        {...(onAddEmployee && { onClick: onAddEmployee })}
      >
        Add Employee
      </Button>
    </div>
  );
}
