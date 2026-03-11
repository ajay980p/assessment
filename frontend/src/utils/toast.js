/**
 * Toast helper: show toast and auto-dismiss.
 * @param {React.Dispatch<React.SetStateAction<{ show: boolean, title: string, message: string }>>} setToast
 * @param {string} title
 * @param {string} message
 * @param {number} [durationMs=5000]
 */
export function showToast(setToast, title, message, durationMs = 5000) {
  setToast({ show: true, title, message });
  setTimeout(() => setToast((p) => ({ ...p, show: false })), durationMs);
}
