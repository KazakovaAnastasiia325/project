import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import * as S from './AdminStyles';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const AdminPage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  
  // Состояния для данных и пагинации
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Настройки пагинации и сортировки
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'desc' }]);

  // Функция загрузки данных с сервера
  const fetchExpertise = async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sort: sortModel.length > 0 ? `${sortModel[0].field},${sortModel[0].sort}` : 'id,desc'
      };

      // Убедитесь, что ваш бэкенд возвращает { content: [], totalElements: 0 }
      const response = await api.get('/api/expertiza/list', { params });
      
      setRows(response.data.content || []);
      setTotalRows(response.data.totalElements || 0);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  // Эффект перезагрузки при смене страницы или сортировки
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

  const handleRowClick = (params) => {
    setSelectedExpertise(params.row);
    setIsDrawerOpen(true);
  };

  const handleSave = async (newData) => {
    try {
      await api.post('/api/expertiza/save', newData);
      setIsDrawerOpen(false);
      alert('Экспертиза успешно сохранена');
      fetchExpertise(); // Обновляем таблицу после сохранения
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить экспертизу');
    }
  };

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ 
          width: '100%', height: '50px', backgroundColor: '#131924', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 3, color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', mb: 2
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Панель администратора</Typography>
        <Button startIcon={<LogoutIcon />} sx={{ color: '#fff', fontSize: '12px' }} onClick={handleLogout}>
          Выйти
        </Button>
      </Box>

      <Box sx={{ px: 3, pt: 0, width: '100%', flexGrow: 1 }}>
        <Box sx={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '10px', mb: 1.5 
          }}
        >
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>Реестр экспертиз</Typography>
          <S.ActionButton startIcon={<AddIcon />} onClick={handleCreate} size="small">
            Добавить
          </S.ActionButton>
        </Box>
        
        <S.TableWrapper sx={{ '& .MuiDataGrid-root': { minHeight: '300px' } }}>
          <DataGridTable 
            rows={rows}
            rowCount={totalRows}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
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