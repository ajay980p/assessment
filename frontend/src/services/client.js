// Set VITE_API_URL in .env (see .env.example). Defaults to local backend.
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore
  }
  if (!res.ok) {
    let message = data?.message ?? data?.detail ?? res.statusText ?? 'Request failed';
    if (Array.isArray(message)) message = message.join(' ');
    if (typeof message !== 'string') message = 'Request failed';
    const err = new Error(message);
    err.response = { status: res.status, data };
    throw err;
  }
  // API format: { success, message, data } — unwrap data for callers
  if (data && data.success === true && 'data' in data) {
    return data.data;
  }
  return data;
}

export default {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
