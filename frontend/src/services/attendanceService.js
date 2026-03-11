import client from './client.js';

/**
 * @param {{ employee_id?: number, from?: string, to?: string, department?: string, status?: string, search?: string, page?: number, limit?: number }} [params]
 * @returns {Promise<{ items: { id: number, employee_id: number, date: string, status: string }[], total: number }>}
 */
export async function getAttendance(params = {}) {
  const sp = new URLSearchParams();
  if (params.employee_id != null) sp.set('employee_id', params.employee_id);
  if (params.from) sp.set('from', params.from);
  if (params.to) sp.set('to', params.to);
  if (params.department) sp.set('department', params.department);
  if (params.status) sp.set('status', params.status);
  if (params.search) sp.set('search', params.search);
  const page = params.page != null ? params.page : 1;
  const limit = params.limit != null ? params.limit : 10;
  sp.set('page', String(page));
  sp.set('limit', String(limit));
  const q = sp.toString();
  return client.get(q ? `/attendance?${q}` : '/attendance');
}

/**
 * @param {string} [dateStr] - YYYY-MM-DD, default today
 * @returns {Promise<{ date: string, total_employees: number, marked_count: number }>}
 */
export async function getAttendanceStats(dateStr) {
  const sp = dateStr ? new URLSearchParams({ date: dateStr }) : new URLSearchParams();
  const q = sp.toString();
  return client.get(q ? `/attendance/stats?${q}` : '/attendance/stats');
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
