import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import AddIcon from '@mui/icons-material/Add';
import * as S from '../Admin/AdminStyles';

// Начальные данные, если localStorage пуст
const initialMockData = [
  { id: 1, date: '2026-06-10', fioexpert: 'Иванов И.И.', status: 'В работе', fabula: 'Кража', ud: '12345/2026', organ: 'ОВД', result: 'В производстве' },
  { id: 2, date: '2026-06-09', fioexpert: 'Петров П.П.', status: 'Создано', fabula: 'ДТП', ud: '67890/2026', organ: 'Суды', result: 'Ожидает' }
];

export const EmployeePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem('expertiseData');
    return savedRows ? JSON.parse(savedRows) : initialMockData;
  });

  useEffect(() => {
    localStorage.setItem('expertiseData', JSON.stringify(rows));
  }, [rows]);

  const handleCreate = () => {
    setSelectedExpertise(null);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (params) => {
    setSelectedExpertise(params.row);
    setIsDrawerOpen(true);
  };

  const handleSave = (newData) => {
    if (selectedExpertise) {
      // Редактирование
      setRows((prev) => prev.map((r) => (r.id === newData.id ? newData : r)));
    } else {
      // Создание
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
          Панель сотрудника
        </Typography>
        <Button 
          startIcon={<LogoutIcon sx={{ fontSize: '16px' }} />} 
          sx={{ color: '#fff', fontSize: '12px', textTransform: 'none' }}
          onClick={() => console.log('Выход')}
        >
          Выйти
        </Button>
      </Box>

      {/* 2. ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ px: 3, pt: 0, width: '100%', flexGrow: 1 }}>
        
        {/* Панель управления реестром */}
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
          
          <S.ActionButton 
            startIcon={<AddIcon fontSize="small" />} 
            onClick={handleCreate}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              color: '#ffffff',
              fontSize: '12px',
              py: 0.5
            }}
          >
            Добавить
          </S.ActionButton>
        </Box>
        
        <S.TableWrapper sx={{ '& .MuiDataGrid-root': { minHeight: '300px' } }}>
          <DataGridTable 
            rows={rows} 
            density="compact"
            onRowClick={handleRowClick} 
            // onDelete не передаем, чтобы скрыть кнопку удаления в таблице
          />
        </S.TableWrapper>

        <DetailsDrawer 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          data={selectedExpertise}
          onSave={handleSave} 
        />
      </Box>
    </S.AdminContainer>
  );
};