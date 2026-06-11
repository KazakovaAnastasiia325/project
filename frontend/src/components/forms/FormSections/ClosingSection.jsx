import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

export const ClosingSection = ({ formData, setFormData }) => {
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          fullWidth label="Дата завершения" type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={formData.dateend || ''} 
          onChange={handleChange('dateend')}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
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
      <Grid size={{ xs: 6 }}>
        <TextField 
          fullWidth label="Общая стоимость" type="number" 
          value={formData.cost || ''} 
          onChange={handleChange('cost')} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          fullWidth label="Трудозатраты (часы)" type="number" 
          value={formData.kolvohour || ''} 
          onChange={handleChange('kolvohour')} 
        />
      </Grid>
    </Grid>
  );
};