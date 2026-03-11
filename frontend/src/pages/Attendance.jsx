import { useState, useMemo, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import AttendanceWarningBanner from '../components/Attendance/AttendanceWarningBanner.jsx';
import MarkAttendanceForm from '../components/Attendance/MarkAttendanceForm.jsx';
import AttendanceRecordsTable from '../components/Attendance/AttendanceRecordsTable.jsx';
import EditAttendanceModal from '../components/Attendance/EditAttendanceModal.jsx';
import { useAttendance } from '../hooks/useAttendance.js';

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
  const [tableDateFilter, setTableDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState(null);

  const filters = useMemo(() => {
    const f = {};
    if (tableDateFilter) {
      f.from = tableDateFilter;
      f.to = tableDateFilter;
    }
    return f;
  }, [tableDateFilter]);

  const {
    records,
    employees,
    loading,
    createAttendance,
    isCreating,
    updateAttendance,
    invalidate,
  } = useAttendance(filters);

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
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.employee_name?.toLowerCase().includes(q) ||
          r.department?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, departmentFilter, search]);

  const handleSubmitEntry = useCallback(
    async (payload) => {
      await createAttendance(payload);
      invalidate();
    },
    [createAttendance, invalidate]
  );

  const handleEditSave = useCallback(
    async (id, payload) => {
      await updateAttendance(id, payload);
      setEditingRecord(null);
      invalidate();
    },
    [updateAttendance, invalidate]
  );

  const handleFixNow = useCallback(() => {
    formRef.current?.scrollIntoView?.({ behavior: 'smooth' });
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
        departmentFilter={departmentFilter}
        dateFilter={tableDateFilter}
        onDepartmentChange={(v) => {
          setDepartmentFilter(v);
          setPage(1);
        }}
        onDateChange={(v) => {
          setTableDateFilter(v);
          setPage(1);
        }}
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
    </div>
  );
}
