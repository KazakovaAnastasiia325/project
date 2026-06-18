import React, { useState, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Badge, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ru';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import * as S from '../Admin/AdminStyles';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { Menu, MenuItem, Divider} from '@mui/material';


export const ManagerPage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
const [errorText, setErrorText] = useState('');
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'asc' }]);
  const [appliedFilters, setAppliedFilters] = useState({ start: null, end: null });
const [notifications, setNotifications] = useState([]);

// Вычисляем количество непрочитанных
const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => !n.read).length 
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
  setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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
      const data = response.data;

      if (data && Array.isArray(data.rows)) {
        setRows(data.rows);
        setTotalRows(data.total || 0);
      } else {
        setRows([]);
        setTotalRows(0);
      }
    } catch (error) {
      toast.error('Ошибка при получении данных.');
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

  return (
    <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '100%', height: '50px', backgroundColor: '#131924', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, color: '#fff', boxShadow: '0 2px 4px rgba(254, 252, 252, 0.1)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Панель руководителя</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {/* Колокольчик */}
    <IconButton color="inherit" onClick={handleClick}>
  <Badge badgeContent={unreadCount} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton>

<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  {Array.isArray(notifications) && notifications.length > 0 ? (
    notifications.map((n) => (
      <MenuItem key={n.id} onClick={() => { markAsRead(n.id); handleClose(); }}>
        <Typography variant="body2" sx={{ fontWeight: n.read ? 'normal' : 'bold' }}>
          {n.text}
        </Typography>
      </MenuItem>
    ))
  ) : (
    <MenuItem>Нет новых уведомлений</MenuItem>
  )}
</Menu>
        <Button startIcon={<LogoutIcon />} sx={{ color: '#fff', textTransform: 'none' }} onClick={handleLogout}>Выйти</Button>
      </Box>

</Box>
      <Box sx={{ px: 3, pt: 2, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '10px 20px', borderRadius: '10px', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>Реестр всех экспертиз</Typography>
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
            isAdmin={false}
            isManager={true}
          />
        </Box>

        <DetailsDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          expertiseId={selectedExpertise?.id}
          isManager={true}
        />
      </Box>
    </S.AdminContainer>
  );
};