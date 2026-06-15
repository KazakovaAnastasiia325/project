import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import AddIcon from '@mui/icons-material/Add';
import * as S from './AdminStyles';

// Создаем инстанс API
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const AdminPage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [rows, setRows] = useState([]);

  // 1. Загрузка данных с сервера (GET)
  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const response = await api.get('/api/expertiza/list');
        setRows(response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchExpertise();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleCreate = () => {
    setSelectedExpertise(null);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (params) => {
    setSelectedExpertise(params.row);
    setIsDrawerOpen(true);
  };

  // 2. Сохранение данных (POST: создание или обновление)
  const handleSave = async (newData) => {
    try {
      const response = await api.post('/api/expertiza/save', newData);
      const savedData = response.data;

      if (selectedExpertise) {
        setRows((prev) => prev.map((r) => (r.id === savedData.id ? savedData : r)));
      } else {
        setRows((prev) => [...prev, savedData]);
      }
      
      setIsDrawerOpen(false);
      alert('Экспертиза успешно сохранена');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить экспертизу на сервере');
    }
  };

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
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

      {/* ОСНОВНОЙ КОНТЕНТ */}
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