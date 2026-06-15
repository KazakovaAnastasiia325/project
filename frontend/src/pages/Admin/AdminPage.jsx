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
  
  // Состояния для данных с сервера
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Модели пагинации и сортировки
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'desc' }]);

  const fetchExpertise = async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sort: sortModel.length > 0 ? `${sortModel[0].field},${sortModel[0].sort}` : 'id,desc'
      };

      const response = await api.get('/api/expertiza/list', { params });
      
      // Логируем для отладки
      console.log('Ответ сервера:', response.data);
      
      // Обеспечиваем корректное извлечение данных
      // Если сервер возвращает { content: [], totalElements: 0 }
      const data = response.data || {};
      setRows(Array.isArray(data.content) ? data.content : []);
      setTotalRows(typeof data.totalElements === 'number' ? data.totalElements : 0);
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setRows([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  // Перезагружаем данные при изменении пагинации или сортировки
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
    // Передаем полную строку данных
    setSelectedExpertise(params.row);
    setIsDrawerOpen(true);
  };

  const handleSave = async (newData) => {
    try {
      await api.post('/api/expertiza/save', newData);
      setIsDrawerOpen(false);
      alert('Успешно сохранено');
      fetchExpertise(); // Обновляем список после сохранения
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении данных');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы действительно хотите удалить эту запись?')) {
      try {
        await api.delete(`/api/expertiza/delete/${id}`);
        fetchExpertise();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка при удалении');
      }
    }
  };

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ width: '100%', height: '50px', backgroundColor: '#131924', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, color: '#fff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Панель администратора</Typography>
        <Button startIcon={<LogoutIcon />} sx={{ color: '#fff' }} onClick={handleLogout}>Выйти</Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 3, pt: 2, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
            onRowClick={handleRowClick}
            onDelete={handleDelete}
            isAdmin={true} 
            isManager={false}
          />
        </Box>

        <DetailsDrawer 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          data={selectedExpertise}
          onSave={handleSave} 
          isManager={false}
        />
      </Box>
    </S.AdminContainer>
  );
};