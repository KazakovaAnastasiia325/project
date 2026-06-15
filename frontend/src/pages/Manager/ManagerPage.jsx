import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Импортируем хук
import { Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import * as S from '../Admin/AdminStyles';

const initialMockData = [
  { id: 1, date: '2026-06-10', fioexpert: 'Иванов И.И.', status: 'В работе', fabula: 'Кража', ud: '12345/2026', organ: 'ОВД', result: 'В производстве' },
  { id: 2, date: '2026-06-09', fioexpert: 'Петров П.П.', status: 'Создано', fabula: 'ДТП', ud: '67890/2026', organ: 'Суды', result: 'Ожидает' }
];

export const ManagerPage = () => {
  const navigate = useNavigate(); // 2. Инициализируем хук
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem('expertiseData');
    return savedRows ? JSON.parse(savedRows) : initialMockData;
  });

  // 3. Функция выхода
  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    localStorage.setItem('expertiseData', JSON.stringify(rows));
  }, [rows]);

  const handleRowClick = (params) => {
    setSelectedExpertise(params.row);
    setIsDrawerOpen(true);
  };

  const handleSave = (newData) => {
    if (selectedExpertise) {
      setRows((prev) => prev.map((r) => (r.id === newData.id ? newData : r)));
    } else {
      const newRow = {
        ...newData,
        id: rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1,
        status: 'Создано'
      };
      setRows((prev) => [...prev, newRow]);
    }
    setIsDrawerOpen(false);
  };

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* 1. ВЕРХНЯЯ ПАНЕЛЬ */}
      <Box sx={{ 
        width: '100%', 
        height: '50px', 
        backgroundColor: '#131924', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 3,
        color: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        mb: 2 
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
          Панель руководителя
        </Typography>
        <Button 
          startIcon={<LogoutIcon sx={{ fontSize: '16px' }} />} 
          sx={{ color: '#fff', fontSize: '12px', textTransform: 'none' }}
          onClick={handleLogout} // 4. Привязываем обработчик
        >
          Выйти
        </Button>
      </Box>

      {/* 2. ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ px: 3, pt: 0, width: '100%', flexGrow: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#1e293b',
          padding: '8px 16px',
          borderRadius: '10px',
          mb: 1.5,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>
            Реестр экспертиз
          </Typography>
        </Box>
        
        <S.TableWrapper sx={{ '& .MuiDataGrid-root': { minHeight: '300px' } }}>
          <DataGridTable 
            rows={rows} 
            isManager={true}
            density="compact"
            onRowClick={handleRowClick} 
          />
        </S.TableWrapper>

        <DetailsDrawer 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          data={selectedExpertise}
          onSave={handleSave} 
          isManager={true}
        />
      </Box>
    </S.AdminContainer>
  );
};