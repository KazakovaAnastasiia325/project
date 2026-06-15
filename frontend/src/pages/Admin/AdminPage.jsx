import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Импортируем хук
import { Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import AddIcon from '@mui/icons-material/Add';
import * as S from './AdminStyles';
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});
export const AdminPage = () => {
  const navigate = useNavigate(); // 2. Инициализируем хук
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem('expertiseData');
    return savedRows ? JSON.parse(savedRows) : [];
  });

  // Функция выхода
  const handleLogout = () => {
    // Если вы храните токен, удалите его:
    // localStorage.removeItem('authToken'); 
    
    // Переход на страницу логина
    navigate('/login');
  };
  

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

  const handleSave = async (newData) => {
    try {
      // Отправляем данные на сервер
      const response = await api.post('/api/expertiza/save', newData);
      
      // Если сервер вернул успех, обновляем таблицу
      const savedData = response.data; // Предполагаем, что бэк вернул объект с присвоенным ID

      if (selectedExpertise) {
        // Редактирование
        setRows((prev) => prev.map((r) => (r.id === savedData.id ? savedData : r)));
      } else {
        // Добавление
        setRows((prev) => [...prev, savedData]);
      }
      
      setIsDrawerOpen(false);
      alert('Экспертиза успешно сохранена');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить экспертизу на сервере');
    }
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* 1. ВЕРХНЯЯ ПАНЕЛЬ */}
      <Box 
        sx={{ 
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
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
           Панель администратора 
        </Typography>
        <Button 
          startIcon={<LogoutIcon sx={{ fontSize: '16px' }} />} 
          sx={{ color: '#fff', fontSize: '12px', textTransform: 'none' }}
          onClick={handleLogout} 
        >
          Выйти
        </Button>
      </Box>

      {/* 2. ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ px: 3, pt: 0, width: '100%', flexGrow: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#1e293b',
            padding: '8px 16px',
            borderRadius: '10px',
            mb: 1.5,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
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
            onDelete={handleDelete} 
            isAdmin={true}
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