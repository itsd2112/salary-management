import { createBrowserRouter } from 'react-router';
import AppLayout from '@/layouts/AppLayout'
import DashboardPage from '@/pages/DashboardPage'
import EmployeeListPage from '@/pages/EmployeeListPage'
import EmployeeDetailPage from '@/pages/EmployeeDetailPage'
import NewEmployeePage from '@/pages/NewEmployeePage'
import NotFoundPage from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'employees', element: <EmployeeListPage /> },
      { path: 'employees/new', element: <NewEmployeePage /> },
      { path: 'employees/:id', element: <EmployeeDetailPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router