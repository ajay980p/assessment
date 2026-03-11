import { Sidebar } from '../components/layout';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-64">
        <div className="min-h-screen px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
