import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { MainLayout } from './components/layouts/MainLayout';
import { Users } from './pages/Admin/Users';
import { AdminPage } from './pages/Admin/AdminPage';
import { Reports } from './pages/Admin/Reports';
import { EmployeePage } from './pages/Employee/EmployeePage';
import { ManagerPage } from './pages/Manager/ManagerPage';
function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Путь для логина */}
        <Route path="/login" element={<LoginPage />} />

        {/* Путь для админки с боковым меню */}
        <Route path="/admin" element={<MainLayout />}>
          <Route path="expertise" element={<AdminPage />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />

          {/* Редирект с /admin на экспертизы по умолчанию */}
          <Route index element={<Navigate to="expertise" replace />} />

        </Route>
        <Route path="/employee" element={<MainLayout />}>
          <Route path="expertise" element={<EmployeePage />} />
          <Route path="reports" element={<Reports />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>
        <Route path="/manager" element={<MainLayout />}>
          <Route path="expertise" element={<ManagerPage />} />
          <Route path="reports" element={<Reports />} />
          <Route index element={<Navigate to="expertise" replace />} />
        </Route>
        {/* Редирект на логин при заходе в корень */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;