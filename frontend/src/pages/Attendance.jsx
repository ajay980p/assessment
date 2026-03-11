import { useState, useMemo, useCallback, useRef } from 'react';
import { ApiErrorBanner, Toast } from '../components/ui';
import MarkAttendanceForm from '../components/Attendance/MarkAttendanceForm.jsx';
import AttendanceRecordsTable from '../components/Attendance/AttendanceRecordsTable.jsx';
import EditAttendanceModal from '../components/Attendance/EditAttendanceModal.jsx';
import { useAttendance, useAttendanceStats } from '../hooks';
import { formatDateForApi, showToast } from '../utils';

const todayStr = formatDateForApi(new Date());

function validateFilters(dateFrom, dateTo) {
  const today = todayStr;
  const errors = [];
  if (dateFrom && dateFrom > today) {
    errors.push('From date cannot be in the future.');
  }
  if (dateTo && dateTo > today) {
    errors.push('To date cannot be in the future.');
  }
  if (dateFrom && dateTo && dateFrom > dateTo) {
    errors.push('To date must be on or after from date.');
  }
  return errors;
}

export default function Attendance() {
  const formRef = useRef(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState(null);

  const PAGE_SIZE = 10;

  const filterErrors = useMemo(() => validateFilters(dateFrom, dateTo), [dateFrom, dateTo]);
  const filtersValid = filterErrors.length === 0;

  const apiFilters = useMemo(() => {
    const f = {
      page,
      limit: PAGE_SIZE,
    };
    if (!filtersValid) {
      return f;
    }
    if (dateFrom) f.from = dateFrom;
    if (dateTo) f.to = dateTo;
    if (employeeFilter) f.employee_id = Number(employeeFilter);
    if (statusFilter) f.status = statusFilter;
    return f;
  }, [page, dateFrom, dateTo, employeeFilter, statusFilter, filtersValid]);

  const {
    records,
    total,
    employees,
    loading,
    error: apiError,
    refetch,
    createAttendance,
    isCreating,
    updateAttendance,
    invalidate,
  } = useAttendance(apiFilters);

  const { missingCount } = useAttendanceStats(todayStr);

  const [submitError, setSubmitError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });


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
    setDateFrom('');
    setDateTo('');
    setEmployeeFilter('');
    setStatusFilter('');
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
        {filterErrors.length > 0 && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {filterErrors.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}
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
            <label className="mb-1 block text-xs font-medium text-gray-500">From Date</label>
            <input
              type="date"
              value={dateFrom}
              max={todayStr}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className={`rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${filterErrors.some((e) => e.includes('From date'))
                ? 'border-amber-400 bg-amber-50'
                : 'border-gray-200 bg-white focus:border-blue-500'
                }`}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">To Date</label>
            <input
              type="date"
              value={dateTo}
              max={todayStr}
              min={dateFrom || undefined}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className={`rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${filterErrors.some((e) => e.includes('To date'))
                ? 'border-amber-400 bg-amber-50'
                : 'border-gray-200 bg-white focus:border-blue-500'
                }`}
            />
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

      <div ref={formRef}>
        <MarkAttendanceForm
          employees={employees}
          onSubmit={handleSubmitEntry}
          isSubmitting={isCreating}
        />
      </div>

      <AttendanceRecordsTable
        records={records}
        onEdit={setEditingRecord}
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
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
