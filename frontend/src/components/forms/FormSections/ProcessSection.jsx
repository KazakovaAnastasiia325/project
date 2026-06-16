import React from 'react';
import axios from 'axios';
import { Grid, TextField, Divider, Typography } from '@mui/material';
import { inputStyle, sectionHeaderStyle } from '../../Registration/RegistrationStyles';
import { EXPERTISE_STATUSES } from '../../../data/mockExpertise';
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});
// Добавляем isManager в пропсы
export const ProcessSection = ({ formData, setFormData, isManager = false }) => {
  // Блокируем, если экспертиза завершена ИЛИ если пользователь — менеджер
  const isLocked = (formData.status === EXPERTISE_STATUSES.COMPLETED.label) || isManager;

  const updateStatus = (prevData) => {
    if (prevData.status === EXPERTISE_STATUSES.NEW.label) {
      return { ...prevData, status: EXPERTISE_STATUSES.IN_PROGRESS.label };
    }
    return prevData;
  };

  const handleChange = (field) => (event) => {
    if (isLocked) return; 
    setFormData((prev) => updateStatus({ ...prev, [field]: event.target.value }));
  };

  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {/* Блок Сроки */}
      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>Сроки производства</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField 
          disabled={isLocked} // Используем isLocked
          size="small" fullWidth label="Срок производства экспертизы (в днях)" type="number"
          value={formData.deadlineDays || ''} onChange={handleChange('deadlineDays')} sx={inputStyle}
        />
      </Grid>

      {/* Блок Приостановление */}
      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>Приостановление производства</Typography>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Дата приост." type="date" 
          slotProps={{ inputLabel: { shrink: true } }} value={formData.stop_date || ''} 
          onChange={handleChange('suspendDate')} sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Дата возоб." type="date" 
          slotProps={{ inputLabel: { shrink: true } }} value={formData.resumeDate || ''} 
          onChange={handleChange('resumeDate')} sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Причина" value={formData.suspendReason || ''} 
          onChange={handleChange('suspendReason')} sx={inputStyle} 
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Дата (срок) продления" type="number" 
          slotProps={{ inputLabel: { shrink: true } }} value={formData.extensionDays || ''} 
          onChange={handleChange('extensionDays')} sx={inputStyle} 
        />
      </Grid>

      {/* Блок Затраты */}
      <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>
      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>Затраты</Typography>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Трудозатраты (чел/час)" type="number" 
          value={formData.laborCosts || ''} onChange={handleChange('laborCosts')} sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Материал. затраты" type="number" 
          value={formData.materialCosts || ''} onChange={handleChange('materialCosts')} sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Эксплуатация оборуд." type="number" 
          value={formData.equipmentCosts || ''} onChange={handleChange('equipmentCosts')} sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Общая стоимость" type="number" 
          value={formData.totalCost || ''} onChange={handleChange('totalCost')} sx={inputStyle} 
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth label="Примечание (№ пломбы)" value={formData.plomba || ''} 
          onChange={handleChange('plomba')} sx={inputStyle} 
        />
      </Grid>
    </Grid>
  );
};