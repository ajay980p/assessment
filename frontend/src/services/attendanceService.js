import client from './client.js';

/**
 * @param {{ employee_id?: number, from?: string, to?: string }} [params]
 * @returns {Promise<{ id: number, employee_id: number, date: string, status: string }[]>}
 */
export async function getAttendance(params = {}) {
  const sp = new URLSearchParams();
  if (params.employee_id != null) sp.set('employee_id', params.employee_id);
  if (params.from) sp.set('from', params.from);
  if (params.to) sp.set('to', params.to);
  const q = sp.toString();
  return client.get(q ? `/attendance?${q}` : '/attendance');
}

/**
 * @param {number} id
 * @returns {Promise<{ id: number, employee_id: number, date: string, status: string }>}
 */
export async function getAttendanceRecord(id) {
  return client.get(`/attendance/${id}`);
}

/**
 * @param {{ employee_id: number, date: string, status: string }} payload - date YYYY-MM-DD
 * @returns {Promise<{ id: number, employee_id: number, date: string, status: string }>}
 */
export async function createAttendance(payload) {
  return client.post('/attendance', payload);
}

/**
 * @param {number} id
 * @param {{ status?: string }} payload
 * @returns {Promise<{ id: number, employee_id: number, date: string, status: string }>}
 */
export async function updateAttendance(id, payload) {
  return client.patch(`/attendance/${id}`, payload);
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteAttendance(id) {
  await client.delete(`/attendance/${id}`);
}
