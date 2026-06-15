import React, { useState } from 'react'; // 1. Добавьте useState
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  // 2. Состояние теперь живет здесь
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundImage: `...`,
      backgroundColor: '#f8fafc', 
      backgroundAttachment: 'fixed',
    }}>
      {/* 3. Передаем состояние и функцию изменения вниз */}
      <Sidebar open={open} setOpen={setOpen} />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          transition: 'margin 0.3s ease', // Плавность
          overflow: 'hidden' // Чтобы контент не вылезал при сжатии
        }}
      >
        <Outlet /> 
      </Box>
    </Box>
  );
};