import { useState, useMemo, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import ApiErrorBanner from '../components/ui/ApiErrorBanner.jsx';
import Toast from '../components/ui/Toast.jsx';
import AttendanceWarningBanner from '../components/Attendance/AttendanceWarningBanner.jsx';
import MarkAttendanceForm from '../components/Attendance/MarkAttendanceForm.jsx';
import AttendanceRecordsTable from '../components/Attendance/AttendanceRecordsTable.jsx';
import EditAttendanceModal from '../components/Attendance/EditAttendanceModal.jsx';
import { useAttendance } from '../hooks/useAttendance.js';

function showToast(setToast, title, message) {
  setToast({ show: true, title, message });
  setTimeout(() => setToast((p) => ({ ...p, show: false })), 5000);
}

function formatDateForApi(d) {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const todayStr = formatDateForApi(new Date());

export default function Attendance() {
  const formRef = useRef(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState(null);

  const apiFilters = useMemo(() => {
    const f = {};
    if (dateFrom) f.from = dateFrom;
    if (dateTo) f.to = dateTo;
    if (employeeFilter) f.employee_id = Number(employeeFilter);
    return f;
  }, [dateFrom, dateTo, employeeFilter]);

  const {
    records,
    employees,
    loading,
    error: apiError,
    refetch,
    createAttendance,
    isCreating,
    updateAttendance,
    invalidate,
  } = useAttendance(apiFilters);

  const departmentOptions = useMemo(() => {
    const set = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(set).sort();
  }, [employees]);

  const [submitError, setSubmitError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  const missingCount = useMemo(() => {
    if (!todayStr || !employees.length) return 0;
    const markedToday = new Set(
      records.filter((r) => r.date === todayStr).map((r) => r.employee_id)
    );
    return employees.filter((e) => !markedToday.has(e.id)).length;
  }, [records, employees, todayStr]);

  const filteredRecords = useMemo(() => {
    let list = records;
    if (departmentFilter) {
      list = list.filter((r) => r.department === departmentFilter);
    }
    if (statusFilter) {
      list = list.filter((r) => r.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.employee_name?.toLowerCase().includes(q) ||
          r.department?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, departmentFilter, statusFilter, search]);

  const handleSubmitEntry = useCallback(
    async (payload) => {
      setSubmitError(null);
      try {
        await createAttendance(payload);
        invalidate();
        showToast(setToast, 'Attendance recorded', 'Entry has been saved successfully.');
      } catch (err) {
        setSubmitError(err?.message ?? 'Failed to save attendance');
      }
    },
    [createAttendance, invalidate]
  );

  const handleEditSave = useCallback(
    async (id, payload) => {
      await updateAttendance(id, payload);
      setEditingRecord(null);
      invalidate();
      showToast(setToast, 'Attendance updated', 'Record has been updated successfully.');
    },
    [updateAttendance, invalidate]
  );

  const handleFixNow = useCallback(() => {
    formRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, []);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    setSubmitError(null);
    try {
      await refetch();
    } finally {
      setIsRetrying(false);
    }
  }, [refetch]);

  const clearFilters = useCallback(() => {
    setDepartmentFilter('');
    setDateFrom('');
    setDateTo('');
    setEmployeeFilter('');
    setStatusFilter('');
    setSearch('');
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-56"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-gray-500">Employee</label>
            <select
              value={employeeFilter}
              onChange={(e) => {
                setEmployeeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium text-gray-500">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departmentOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Clear filters
          </button>
        </div>
      </div>

      {apiError && (
        <ApiErrorBanner
          message={apiError}
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      )}

      {submitError && !apiError && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">{submitError}</p>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            className="shrink-0 text-sm font-medium text-red-700 underline hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <AttendanceWarningBanner missingCount={missingCount} onFixNow={handleFixNow} />

      <div ref={formRef}>
        <MarkAttendanceForm
          employees={employees}
          onSubmit={handleSubmitEntry}
          isSubmitting={isCreating}
        />
      </div>

      <AttendanceRecordsTable
        records={filteredRecords}
        onEdit={setEditingRecord}
        page={page}
        total={filteredRecords.length}
        onPageChange={setPage}
      />

      <EditAttendanceModal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        record={editingRecord}
        onSave={handleEditSave}
      />

      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onDismiss={() => setToast((p) => ({ ...p, show: false }))}
      />
    </div>
  );
}
