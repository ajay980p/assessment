import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts';
import Dashboard from '../pages/Dashboard.jsx';
import Employees from '../pages/Employees';
import Attendance from '../pages/Attendance.jsx';
import Settings from '../pages/Settings.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/employees" element={<MainLayout><Employees /></MainLayout>} />
      <Route path="/attendance" element={<MainLayout><Attendance /></MainLayout>} />
      <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
    </Routes>
  );
}
