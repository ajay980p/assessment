/**
 * Route paths and nav config. Single source of truth for URLs.
 */
export const PATHS = {
  HOME: '/',
  EMPLOYEES: '/employees',
  ATTENDANCE: '/attendance',
  SETTINGS: '/settings',
};

/** Main nav items for sidebar (to + label). Icons are wired in Sidebar. */
export const MAIN_NAV = [
  { to: PATHS.HOME, label: 'Dashboard' },
  { to: PATHS.EMPLOYEES, label: 'Employees' },
  { to: PATHS.ATTENDANCE, label: 'Attendance' },
];

export default PATHS;
