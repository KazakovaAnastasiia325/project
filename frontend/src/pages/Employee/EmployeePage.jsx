import React, { useState, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Badge, IconButton} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ru';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import * as S from '../Admin/AdminStyles';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { Menu, MenuItem, Divider } from '@mui/material';


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
  const [notifications, setNotifications] = useState([]);

// Вычисляем количество непрочитанных
const unreadCount = Array.isArray(notifications) 
  ? notifications.filter(n => !n.is_read).length 
  : 0;
const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

const handleClick = (event) => setAnchorEl(event.currentTarget);
const handleClose = () => setAnchorEl(null);

  const fetchNotifications = async () => {
    
    try {
    const res = await api.get('/api/notifications');
    setNotifications(res.data);
    } catch (error) {
    console.error('Ошибка загрузки уведомлений:', error);
  }
  };
  useEffect(() => {
  fetchNotifications();
}, []);
const markAsRead = async (id) => {
  await api.put(`/api/notifications/read/${id}`);
  setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
};
const markAllAsRead = async () => {
    try {
        await api.put('/api/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) { toast.error('Ошибка при обновлении'); }
};
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
      toast.success('Экспертиза успешно создана');
      setSelectedExpertise(null);
      await fetchExpertise();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('Ошибка при сохранении: ' + (error.response?.data?.error || 'неизвестная ошибка'));
    }
  };

  // Метод для обновления существующей записи
  const handleUpdate = async (dataToUpdate) => {
    try {
      console.log("Отправляем на обновление:", dataToUpdate);
      await api.put(`/api/expertiza/update/${dataToUpdate.id}`, dataToUpdate);
      setIsDrawerOpen(false);
      toast.success('Данные успешно обновлены');
      await fetchExpertise();
    } catch (error) {
      console.error('Ошибка обновления:', error);
      toast.error('Ошибка при обновлении: ' + (error.response?.data?.error || 'неизвестная ошибка'));
    }
  };

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '100%', height: '50px', backgroundColor: '#131924', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Панель сотрудника</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {/* Колокольчик */}
    <IconButton color="inherit" onClick={handleClick}>
  <Badge badgeContent={unreadCount} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton>

<Menu 
    anchorEl={anchorEl} 
    open={open} 
    onClose={handleClose}
    slotProps={{
        paper: {
            sx: { 
                width: 350, 
                maxHeight: 400, 
                borderRadius: '12px',
                mt: 1,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }
        }
    }}
>
    {/* Заголовок с кнопкой прочитать все */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #e2e8f0' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Уведомления</Typography>
        {unreadCount > 0 && (
            <Button size="small" onClick={() => {markAllAsRead()}} sx={{ fontSize: '11px', textTransform: 'none' }}>
                Прочитать все
            </Button>
        )}
    </Box>

    {/* Список уведомлений */}
    {notifications.length > 0 ? (
        notifications.map((n) => (
            <MenuItem 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                sx={{ 
                    whiteSpace: 'normal', 
                    py: 1.5, 
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: n.is_read ? 'transparent' : '#f0f7ff' 
                }}
            >
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: n.is_read ? 400 : 600, color: '#1e293b' }}>
                        {n.text}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {new Date(n.created_at).toLocaleString()}
                    </Typography>
                </Box>
            </MenuItem>
        ))
    ) : (
        <Box sx={{ p: 3, textAlign: 'center', color: '#94a3b8' }}>
            <NotificationsIcon sx={{ fontSize: 40, opacity: 0.3 }} />
            <Typography variant="body2">Нет новых уведомлений</Typography>
        </Box>
    )}
</Menu>

    <Button startIcon={<LogoutIcon />} sx={{ color: '#fff' }} onClick={handleLogout}>
      Выйти
    </Button>
  </Box>
      </Box>

      <Box sx={{ px: 3, pt: 2, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        

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