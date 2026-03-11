import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance.jsx';
import Payroll from './pages/Payroll.jsx';
import Settings from './pages/Settings.jsx';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-64">
        <div className="min-h-screen px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/employees"
        element={
          <Layout>
            <Employees />
          </Layout>
        }
      />
      <Route
        path="/attendance"
        element={
          <Layout>
            <Attendance />
          </Layout>
        }
      />
      <Route
        path="/payroll"
        element={
          <Layout>
            <Payroll />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
    </Routes>
  );
}
