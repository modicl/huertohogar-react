import { useEffect } from 'react';
import { AdminDashboard } from '../components/AdminDashboard';

export function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard - Admin | HuertoHogar';
  }, []);

  return <AdminDashboard />;
}
