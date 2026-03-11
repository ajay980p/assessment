import client from './client.js';

/**
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }[]>}
 */
export async function getEmployees() {
  const { data } = await client.get('/employees');
  return data;
}

/**
 * @param {string} employeeId - e.g. "EMP-2001"
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }>}
 */
export async function getEmployee(employeeId) {
  const { data } = await client.get(`/employees/${encodeURIComponent(employeeId)}`);
  return data;
}

/**
 * @param {{ full_name: string, email: string, department: string }} payload
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }>}
 */
export async function createEmployee(payload) {
  const { data } = await client.post('/employees', payload);
  return data;
}

/**
 * @param {string} employeeId
 * @param {{ full_name?: string, email?: string, department?: string }} payload
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }>}
 */
export async function updateEmployee(employeeId, payload) {
  const { data } = await client.patch(`/employees/${encodeURIComponent(employeeId)}`, payload);
  return data;
}

/**
 * @param {string} employeeId
 * @returns {Promise<void>}
 */
export async function deleteEmployee(employeeId) {
  await client.delete(`/employees/${encodeURIComponent(employeeId)}`);
}
