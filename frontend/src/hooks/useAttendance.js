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

  const { data: records = [], isLoading } = useQuery({
    queryKey: [...attendanceQueryKey, { from, to, employee_id: employeeId }],
    queryFn: () =>
      attendanceService.getAttendance({
        ...(from && { from }),
        ...(to && { to }),
        ...(employeeId != null && { employee_id: employeeId }),
      }),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getEmployees,
  });

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

  return {
    records: recordsWithEmployee,
    employees,
    loading: isLoading,
    createAttendance: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAttendance: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    invalidate: () => queryClient.invalidateQueries({ queryKey: attendanceQueryKey }),
  };
}
