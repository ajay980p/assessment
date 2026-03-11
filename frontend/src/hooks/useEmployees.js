import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as employeeService from '../services/employeeService.js';

export const employeesQueryKey = ['employees'];

export function useEmployees() {
  const queryClient = useQueryClient();

  const {
    data: employees = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchEmployees,
  } = useQuery({
    queryKey: employeesQueryKey,
    queryFn: employeeService.getEmployees,
  });

  const deleteMutation = useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: (_, employeeId) => {
      queryClient.setQueryData(employeesQueryKey, (old) =>
        (old ?? []).filter((e) => e.employee_id !== employeeId)
      );
    },
  });

  const deleteEmployee = async (employeeId) => {
    await deleteMutation.mutateAsync(employeeId);
  };

  const error =
    queryError?.response?.data?.detail ?? queryError?.message ?? deleteMutation.error?.response?.data?.detail ?? deleteMutation.error?.message ?? null;

  const invalidateEmployees = () => queryClient.invalidateQueries({ queryKey: employeesQueryKey });

  return {
    employees,
    loading,
    error: error || null,
    fetchEmployees,
    deleteEmployee,
    invalidateEmployees,
  };
}
