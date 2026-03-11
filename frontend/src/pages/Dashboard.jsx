import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, UserCheck, UserX, ArrowRight } from 'lucide-react';
import { dashboardService } from '../services';
import { PATHS } from '../config';

const statCardConfig = [
  {
    key: 'total_employees',
    title: 'Total Employees',
    subtext: 'Registered in system',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
    href: PATHS.EMPLOYEES,
  },
  {
    key: 'today_present',
    title: "Today's Present",
    subtext: 'Marked present today',
    icon: UserCheck,
    color: 'bg-green-50 text-green-600',
    href: PATHS.ATTENDANCE,
  },
  {
    key: 'today_absent',
    title: "Today's Absent",
    subtext: 'Marked absent today',
    icon: UserX,
    color: 'bg-amber-50 text-amber-600',
    href: PATHS.ATTENDANCE,
  },
  {
    key: 'today_pending',
    title: 'Pending Today',
    subtext: 'Not marked yet',
    icon: Calendar,
    color: 'bg-gray-100 text-gray-600',
    href: PATHS.ATTENDANCE,
  },
];

const quickActions = [
  { label: 'Manage Employees', href: '/employees', description: 'Add, edit or remove employees' },
  { label: 'Mark Attendance', href: '/attendance', description: 'Record daily attendance' },
];

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardStats(),
  });

  const getValue = (key) => {
    if (error || isLoading) return '—';
    return stats != null && typeof stats[key] === 'number' ? String(stats[key]) : '—';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your HRMS Lite instance
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Could not load dashboard stats. Ensure the backend is running.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCardConfig.map((card) => {
          const Icon = card.icon;
          const value = getValue(card.key);
          return (
            <Link
              key={card.title}
              to={card.href}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-gray-900">{value}</p>
              <p className="text-sm font-medium text-gray-700">{card.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{card.subtext}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Shortcuts to common tasks
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex min-w-[200px] items-center gap-4 rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm">
                {action.href === '/employees' ? (
                  <Users className="h-5 w-5" />
                ) : (
                  <Calendar className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Welcome to HRMS Lite</h2>
        <p className="mt-2 text-sm text-gray-600">
          Use the sidebar to navigate to Employees, Attendance, or Settings. Stats above show live
          data from the backend.
        </p>
      </div>
    </div>
  );
}
