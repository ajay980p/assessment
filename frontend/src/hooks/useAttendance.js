import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as attendanceService from '../services/attendanceService.js';
import * as employeeService from '../services/employeeService.js';

export const attendanceQueryKey = ['attendance'];

/**
 * @param {{ from?: string, to?: string, employee_id?: number, department?: string, status?: string, search?: string, page?: number, limit?: number }} [filters]
 */
export function useAttendance(filters = {}) {
  const queryClient = useQueryClient();
  const from = filters.from;
  const to = filters.to;
  const employeeId = filters.employee_id;
  const department = filters.department;
  const status = filters.status;
  const search = filters.search;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  const {
    data: rawPayload,
    isLoading,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: [
      ...attendanceQueryKey,
      { from, to, employee_id: employeeId, department, status, search, page, limit },
    ],
    queryFn: () =>
      attendanceService.getAttendance({
        ...(from && { from }),
        ...(to && { to }),
        ...(employeeId != null && { employee_id: employeeId }),
        ...(department && { department }),
        ...(status && { status }),
        ...(search && { search }),
        page,
        limit,
      }),
  });

  const items = Array.isArray(rawPayload?.items) ? rawPayload.items : [];
  const total = typeof rawPayload?.total === 'number' ? rawPayload.total : 0;
  const records = items;

  const { data: rawEmployees = [], error: employeesError, refetch: refetchEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getEmployees,
  });

  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const createMutation = useMutation({
    mutationFn: attendanceService.createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => attendanceService.updateAttendance(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKey });
    },
  });

  const employeeMap = Object.fromEntries(employees.map((e) => [e.id, e]));
  const recordsWithEmployee = records.map((r) => ({
    ...r,
    employee_name: employeeMap[r.employee_id]?.full_name ?? '—',
    department: employeeMap[r.employee_id]?.department ?? '—',
  }));

  const error =
    attendanceError?.message ?? employeesError?.message ?? createMutation.error?.message ?? null;

  const refetch = useCallback(async () => {
    await Promise.all([refetchAttendance(), refetchEmployees()]);
  }, [refetchAttendance, refetchEmployees]);

  return {
    records: recordsWithEmployee,
    total,
    employees,
    loading: isLoading,
    error,
    refetch,
    createAttendance: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAttendance: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    invalidate: () => queryClient.invalidateQueries({ queryKey: attendanceQueryKey }),
  };
}

/**
 * @param {string} [dateStr] - YYYY-MM-DD for stats (default today)
 */
export function useAttendanceStats(dateStr) {
  const { data } = useQuery({
    queryKey: ['attendance', 'stats', dateStr ?? 'today'],
    queryFn: () => attendanceService.getAttendanceStats(dateStr),
  });
  const total_employees = data?.total_employees ?? 0;
  const marked_count = data?.marked_count ?? 0;
  const missingCount = Math.max(0, total_employees - marked_count);
  return { total_employees, marked_count, missingCount };
}
