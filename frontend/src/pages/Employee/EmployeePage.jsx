import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ru';
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
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ start: null, end: null });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'asc' }]);

  const fetchExpertise = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const params = {
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        date_from: appliedFilters.start ? appliedFilters.start.format('YYYY-MM-DD') : undefined,
        date_to: appliedFilters.end ? appliedFilters.end.format('YYYY-MM-DD') : undefined,
        sort_field: sortModel[0]?.field || 'id',
        sort_order: sortModel[0]?.sort || 'asc',
      };

      const response = await api.get('/api/expertiza/list', { params });
      console.log('Данные от бэкенда:', response.data);
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
  }, [paginationModel, sortModel, appliedFilters]);

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('Ошибка при вызове logout на сервере:', error);
    } finally {
      navigate('/login');
    }
  };

  const handleCreate = () => {
    setSelectedExpertise(null);
    setIsDrawerOpen(true);
  };
  const handleSave = async (dataToSave) => {
    try {
      await api.post('/api/expertiza/save', dataToSave);
      setIsDrawerOpen(false);
      alert('Успешно сохранено');
      setSelectedExpertise(null);
      await fetchExpertise();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении: ' + (error.response?.data?.error || 'неизвестная ошибка'));
    }
  };

  // Метод для обновления существующей записи
  const handleUpdate = async (dataToUpdate) => {
    try {
      console.log("Отправляем на обновление:", dataToUpdate);
      await api.put(`/api/expertiza/update/${dataToUpdate.id}`, dataToUpdate);
      setIsDrawerOpen(false);
      alert('Успешно обновлено');
      await fetchExpertise();
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка при обновлении: ' + (error.response?.data?.error || 'неизвестная ошибка'));
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
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 1.5, mb: 2, borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker label="С даты" value={dateRange.start} onChange={(v) => setDateRange(p => ({ ...p, start: v }))} slotProps={{ textField: { size: 'small', sx: { maxWidth: '150px' } } }} />
            <DatePicker label="По дату" value={dateRange.end} onChange={(v) => setDateRange(p => ({ ...p, end: v }))} slotProps={{ textField: { size: 'small', sx: { maxWidth: '150px' } } }} />
          </LocalizationProvider>
          <S.ActionButton
            variant="contained"
            size="small"
            onClick={() => setAppliedFilters(dateRange)}
            sx={{ height: '40px' }}
          >
            Найти
          </S.ActionButton>
          <S.ActionButton
            size="small"
            variant="outlined"
            onClick={() => {
              setDateRange({ start: null, end: null });
              setAppliedFilters({ start: null, end: null });
            }}
            sx={{ height: '40px' }}
          >
            Сбросить
          </S.ActionButton>
        </Box>
        <Box sx={{
          height: 550,
          width: '100%',
          mb: 2,
          '& .MuiDataGrid-root': {
            border: 'none',
          }
        }}>
          <DataGridTable
            rows={rows}
            rowCount={totalRows}
            loading={loading}
            density="compact"
            rowHeight={40}
            columnHeaderHeight={40}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            onRowClick={(params) => {
              setSelectedExpertise(params.row);
              setIsDrawerOpen(true);
            }}
            isAdmin={true}
            isManager={false}
          />
        </Box>

        <DetailsDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          expertiseId={selectedExpertise?.id}
          onSave={handleSave}
          onUpdate={handleUpdate}
          isManager={false}
        />
      </Box>
    </S.AdminContainer>
  );
};