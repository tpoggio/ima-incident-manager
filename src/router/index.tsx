import { createHashRouter, Navigate } from 'react-router-dom';
import { MainLayout, ProtectedRoute } from '@/components/layout';
import { LoginPage, DashboardPage, IncidentDetailPage } from '@/pages';

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/incidentes/:id',
            element: <IncidentDetailPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
