import client from './client.js';

/**
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }[]>}
 */
export async function getEmployees() {
  return client.get('/employees');
}

/**
 * @param {string} employeeId - e.g. "EMP-2001"
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }>}
 */
export async function getEmployee(employeeId) {
  return client.get(`/employees/${encodeURIComponent(employeeId)}`);
}

/**
 * @param {{ full_name: string, email: string, department: string }} payload
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }>}
 */
export async function createEmployee(payload) {
  return client.post('/employees', payload);
}

/**
 * @param {string} employeeId
 * @param {{ full_name?: string, email?: string, department?: string }} payload
 * @returns {Promise<{ id: number, employee_id: string, full_name: string, email: string, department: string }>}
 */
export async function updateEmployee(employeeId, payload) {
  return client.patch(`/employees/${encodeURIComponent(employeeId)}`, payload);
}

/**
 * @param {string} employeeId
 * @returns {Promise<void>}
 */
export async function deleteEmployee(employeeId) {
  await client.delete(`/employees/${encodeURIComponent(employeeId)}`);
}
