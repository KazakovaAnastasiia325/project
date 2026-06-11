// src/components/Layout/MainLayout.jsx
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Обязательно импортировать
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet /> 
      </Box>
    </Box>
  );
};