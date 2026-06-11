import React from 'react';
import { Grid, TextField, MenuItem, Typography, Divider } from '@mui/material';

export const ClosingSection = ({ formData, setFormData }) => {
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {/* Основные даты и результаты */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          fullWidth label="Дата завершения" type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={formData.dateend || ''} 
          onChange={handleChange('dateend')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          select fullWidth label="Результат исследования" 
          value={formData.result || ''}
          onChange={handleChange('result')}
        >
          <MenuItem value={1}>Заключение</MenuItem>
          <MenuItem value={2}>СНДЗ</MenuItem>
          <MenuItem value={3}>Возврат без исполнения</MenuItem>
        </TextField>
      </Grid>

      {/* Сроки нахождения */}
      <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          fullWidth label="Дней в тер. подразделении" type="number"
          value={formData.daysInUnit || ''} 
          onChange={handleChange('daysInUnit')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          fullWidth label="Дней у эксперта" type="number"
          value={formData.daysWithExpert || ''} 
          onChange={handleChange('daysWithExpert')}
        />
      </Grid>

      {/* Выводы */}
      <Grid size={{ xs: 12 }}><Typography variant="subtitle2" sx={{ mt: 1 }}>Дано выводов:</Typography></Grid>
      <Grid size={{ xs: 4 }}>
        <TextField fullWidth label="Категорические" type="number" value={formData.conclCategorical || ''} onChange={handleChange('conclCategorical')} />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField fullWidth label="Вероятные" type="number" value={formData.conclProbable || ''} onChange={handleChange('conclProbable')} />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField fullWidth label="НПВ" type="number" value={formData.conclNPV || ''} onChange={handleChange('conclNPV')} />
      </Grid>

      {/* Время */}
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth label="Кол-во часов на производство экспертизы" type="number"
          value={formData.hoursSpent || ''} 
          onChange={handleChange('hoursSpent')}
        />
      </Grid>
    </Grid>
  );
};