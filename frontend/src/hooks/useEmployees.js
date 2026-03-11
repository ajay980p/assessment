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
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteEmployee = async (employeeId) => {
    await deleteMutation.mutateAsync(employeeId);
  };

  // Only show list-fetch errors in page banner; delete errors show in DeleteEmployeeModal
  const error =
    queryError?.response?.data?.message ?? queryError?.response?.data?.detail ?? queryError?.message ?? null;

  const invalidateEmployees = () => {
    queryClient.invalidateQueries({ queryKey: employeesQueryKey });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  return {
    employees,
    loading,
    error: error || null,
    fetchEmployees,
    deleteEmployee,
    invalidateEmployees,
  };
}
