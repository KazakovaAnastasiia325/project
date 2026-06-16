import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import * as S from './AdminStyles';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const AdminPage = () => {
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
      };

      if (sortModel.length > 0) {
        params.sort_field = sortModel[0].field;
        params.sort_order = sortModel[0].sort;
      } else {
        params.sort_field = 'id';
        params.sort_order = 'desc';
      }

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
      console.error('Детали ошибки:', error);
      if (error.response?.status === 303 || error.response?.status === 302) {
        setErrorText('Ошибка доступа: Сессия истекла. Перенаправление на логин...');
      } else {
        setErrorText(`Ошибка загрузки: ${error.response?.status || error.message}`);
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

  // МАСШТАБНЫЙ МАППИНГ ДАННЫХ ДЛЯ БЭКЕНДА GO
  const handleSave = async (newData) => {
    // Безопасный съем фокуса с активной кнопки перед отправкой
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }


    // Собираем объект строго по спецификации Go-структуры структуры Exp
    const mappedBackendData = {
      id: newData.id ? Number(newData.id) : 0,
      creator_id: newData.creator_id ? Number(newData.creator_id) : 1,
      data_post: newData.date || "",                     // из 'date' в 'data_post'
      adm_material: newData.ud ? Number(newData.ud) : 0, // из 'ud' в 'adm_material'
      fab: newData.fabula || "",                         // из 'fabula' в 'fab'
      nom_statyi: newData.state || "",                   // из 'state' в 'nom_statyi'
      vid_exp: newData.view ? Number(newData.view) : 0,  // из 'view' в 'vid_exp'
      
      // Списки параметров экспертизы
      stat_id: newData.statys ? Number(newData.statys) : 1,
      iz_nix_id: newData.typeExpertise ? Number(newData.typeExpertise) : 1,
      category_id: newData.category ? Number(newData.category) : 1,
      diff_cat_id: newData.complexity ? Number(newData.complexity) : 1,
      region_id: newData.region ? Number(newData.region) : 0,
      
      // Органы назначения
      organ: newData.organCode || "01",
      name_organ: newData.organName || "",
      
      // Счетчики
      question_count: newData.kolvo ? Number(newData.kolvo) : 0,
      object_count: newData.kolvoobj ? Number(newData.kolvoobj) : 0,
      is_closed: newData.is_closed || false,
      
      // Лицо, назначившее экспертизу (Устраняем проблему пустых строк)
      second_name_naznch: newData.naznch_last || "",   // Фамилия
      name_naznch: newData.naznch_first || "",         // Имя
      patronymic_naznch: newData.naznch_middle || "", // Отчество (теперь гарантированно летит ключом)

      // Список экспертов
      experts: Array.isArray(newData.experts) 
        ? newData.experts.map(exp => ({
            id: exp.id ? Number(exp.id) : 0,
            name: exp.name || "",
            second_name: exp.second_name || "",
            patronymic: exp.patronymic || ""
          }))
        : []
    };

    console.log("=== JSON ОТПРАВЛЯЕМЫЙ НА БЭКЕНД ===", mappedBackendData);

    try {
      await api.post('/api/expertiza/save', mappedBackendData);
      setIsDrawerOpen(false);
      alert('Успешно сохранено');
      fetchExpertise();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert(`Ошибка при сохранении: ${error.response?.data?.error || error.message}`);
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
      <Box sx={{ width: '100%', height: '50px', backgroundColor: '#131924', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, color: '#fff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Панель администратора</Typography>
        <Button startIcon={<LogoutIcon />} sx={{ color: '#fff' }} onClick={handleLogout}>Выйти</Button>
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
            onRowClick={(params) => { setSelectedExpertise(params.row); setIsDrawerOpen(true); }}
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
