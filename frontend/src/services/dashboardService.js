import client from './client.js';

/**
 * @returns {Promise<{ total_employees: number, today_present: number, today_absent: number, today_pending: number }>}
 */
export async function getDashboardStats() {
  return client.get('/dashboard');
}
