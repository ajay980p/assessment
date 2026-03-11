import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as attendanceService from '../services/attendanceService.js';
import * as employeeService from '../services/employeeService.js';

export const attendanceQueryKey = ['attendance'];

/**
 * @param {{ from?: string, to?: string, employee_id?: number }} [filters]
 */
export function useAttendance(filters = {}) {
  const queryClient = useQueryClient();
  const from = filters.from;
  const to = filters.to;
  const employeeId = filters.employee_id;

  const {
    data: rawRecords,
    isLoading,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: [...attendanceQueryKey, { from, to, employee_id: employeeId }],
    queryFn: () =>
      attendanceService.getAttendance({
        ...(from && { from }),
        ...(to && { to }),
        ...(employeeId != null && { employee_id: employeeId }),
      }),
  });

  const records = Array.isArray(rawRecords) ? rawRecords : [];

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
