import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { MainLayout } from './components/layouts/MainLayout';
import { Users } from './pages/Admin/Users';
import { AdminPage } from './pages/Admin/AdminPage';
import { EmployeePage } from './pages/Employee/EmployeePage';
import { ManagerPage } from './pages/Manager/ManagerPage';

// Простая обертка для защиты маршрутов
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Защищенные маршруты для Администратора */}
        <Route path="/admin" element={<PrivateRoute role="admin"><MainLayout /></PrivateRoute>}>
          <Route path="expertise" element={<AdminPage />} />
          <Route path="users" element={<Users />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>

        {/* Защищенные маршруты для Сотрудника */}
        <Route path="/employee" element={<PrivateRoute role="employee"><MainLayout /></PrivateRoute>}>
          <Route path="expertise" element={<EmployeePage />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>

        {/* Защищенные маршруты для Руководителя */}
        <Route path="/manager" element={<PrivateRoute role="manager"><MainLayout /></PrivateRoute>}>
          <Route path="expertise" element={<ManagerPage />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;