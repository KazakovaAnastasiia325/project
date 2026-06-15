import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { MainLayout } from './components/layouts/MainLayout';
import { Users } from './pages/Admin/Users';
import { AdminPage } from './pages/Admin/AdminPage';
import { EmployeePage } from './pages/Employee/EmployeePage';
import { ManagerPage } from './pages/Manager/ManagerPage';

// Создаем инстанс axios здесь, чтобы не создавать новые файлы
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// Защищенный роут теперь сам делает запрос к /api/auth/me
const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/me');
        setRole(Number(response.data.role));
        setAuthorized(true);
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!authorized) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Защищенные маршруты */}
        <Route path="/admin" element={<PrivateRoute requiredRole={1}><MainLayout /></PrivateRoute>}>
          <Route path="expertise" element={<AdminPage />} />
          <Route path="users" element={<Users />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>

        <Route path="/manager" element={<PrivateRoute requiredRole={2}><MainLayout /></PrivateRoute>}>
          <Route path="expertise" element={<ManagerPage />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>

        <Route path="/employee" element={<PrivateRoute requiredRole={3}><MainLayout /></PrivateRoute>}>
          <Route path="expertise" element={<EmployeePage />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;