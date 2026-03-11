/**
 * Date formatting helpers (API format YYYY-MM-DD, display, etc.)
 */

/**
 * @param {Date | string | number} d
 * @returns {string} YYYY-MM-DD
 */
export function formatDateForApi(d) {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * @param {Date | string | number} date
 * @returns {string} YYYY-MM-DD for use in <input type="date">
 */
export function formatDateForInput(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
