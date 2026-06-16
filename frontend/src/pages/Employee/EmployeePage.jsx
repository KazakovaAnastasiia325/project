import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import * as S from '../Admin/AdminStyles';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const EmployeePage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'desc' }]);

  const fetchExpertise = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const params = {
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        sort_field: sortModel[0]?.field || 'id',
        sort_order: sortModel[0]?.sort || 'desc',
      };

      const response = await api.get('/api/expertiza/list', { params });
      const data = response.data;

      if (data && Array.isArray(data.rows)) {
        setRows(data.rows);
        setTotalRows(data.total || 0);
      } else {
        setRows([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      
      const isAuthError = error.response?.status === 401 || 
                          error.response?.status === 403 || 
                          error.request?.responseURL?.includes('/login');

      if (isAuthError) {
        setErrorText('Сессия истекла. Пожалуйста, перезайдите.');
        setTimeout(() => handleLogout(), 2500);
      } else {
        setErrorText('Ошибка при получении данных.');
      }
      setRows([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertise();
  }, [paginationModel, sortModel]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleCreate = () => {
    setSelectedExpertise(null);
    setIsDrawerOpen(true);
  };

  // Метод для создания новой записи (POST)
  const handleSave = async (dataToSave) => {
    try {
      await api.post('/api/expertiza/save', dataToSave);
      setIsDrawerOpen(false);
      alert('Успешно сохранено');
      fetchExpertise();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении данных.');
    }
  };

  // Метод для обновления существующей записи (PUT)
  const handleUpdate = async (dataToUpdate) => {
    try {
      await api.put(`/api/expertiza/update/${dataToUpdate.id}`, dataToUpdate);
      setIsDrawerOpen(false);
      alert('Успешно обновлено');
      fetchExpertise();
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка при обновлении данных.');
    }
  };

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '100%', height: '50px', backgroundColor: '#131924', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Панель сотрудника</Typography>
        <Button startIcon={<LogoutIcon />} sx={{ color: '#fff', textTransform: 'none' }} onClick={handleLogout}>Выйти</Button>
      </Box>

      <Box sx={{ px: 3, pt: 2, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {errorText && <Alert severity="error" sx={{ mb: 2 }}>{errorText}</Alert>}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '10px 20px', borderRadius: '10px', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>Реестр экспертиз</Typography>
          <S.ActionButton startIcon={<AddIcon />} onClick={handleCreate} size="small" variant="contained">
            Добавить
          </S.ActionButton>
        </Box>
        
        <Box sx={{ flexGrow: 1, mb: 3 }}>
          <DataGridTable 
            rows={rows}
            rowCount={totalRows}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            onRowClick={(params) => { 
              setSelectedExpertise(params.row); 
              setIsDrawerOpen(true); 
            }}
            isAdmin={false} // Важно: удаление у сотрудника скрыто (через Table компоненты)
            isManager={false}
          />
        </Box>

        <DetailsDrawer 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          expertiseId={selectedExpertise?.id} // Передаем ID для корректной работы формы
          onSave={handleSave} 
          onUpdate={handleUpdate} // Передаем метод обновления
          isManager={false}
        />
      </Box>
    </S.AdminContainer>
  );
};