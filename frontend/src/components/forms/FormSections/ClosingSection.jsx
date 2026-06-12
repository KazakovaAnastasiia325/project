import React from 'react';
import { Grid, TextField, MenuItem, Typography, Divider } from '@mui/material';

export const ClosingSection = ({ formData, setFormData, inputStyle, errors = {} }) => {
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          required 
          error={!!errors.dateend}
          fullWidth label="Дата завершения" type="date"
          sx={inputStyle}
          slotProps={{ inputLabel: { shrink: true } }}
          value={formData.dateend || ''} 
          onChange={handleChange('dateend')}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          required 
          error={!!errors.result}
          select fullWidth label="Результат исследования" 
          sx={inputStyle}
          value={formData.result || ''}
          onChange={handleChange('result')}
        >
          <MenuItem value={1}>Заключение</MenuItem>
          <MenuItem value={2}>СНДЗ</MenuItem>
          <MenuItem value={3}>Возврат без исполнения</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          required 
          error={!!errors.daysInUnit}
          fullWidth label="Дней в тер. подразделении" type="number"
          sx={inputStyle} 
          value={formData.daysInUnit || ''} 
          onChange={handleChange('daysInUnit')}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          required 
          error={!!errors.daysWithExpert}
          fullWidth label="Дней у эксперта" type="number"
          sx={inputStyle} 
          value={formData.daysWithExpert || ''} 
          onChange={handleChange('daysWithExpert')}
        />
      </Grid>

      <Grid size={{ xs: 12 }}><Typography variant="subtitle2" sx={{ mt: 1 }}>Дано выводов:</Typography></Grid>
      
      <Grid size={{ xs: 4 }}>
        <TextField required error={!!errors.conclCategorical} fullWidth label="Категорические" type="number" sx={inputStyle} value={formData.conclCategorical || ''} onChange={handleChange('conclCategorical')} />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField required error={!!errors.conclProbable} fullWidth label="Вероятные" type="number" sx={inputStyle} value={formData.conclProbable || ''} onChange={handleChange('conclProbable')} />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField required error={!!errors.conclNPV} fullWidth label="НПВ" type="number" sx={inputStyle} value={formData.conclNPV || ''} onChange={handleChange('conclNPV')} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField 
          required 
          error={!!errors.hoursSpent}
          fullWidth label="Кол-во часов на производство экспертизы" type="number"
          sx={inputStyle} 
          value={formData.hoursSpent || ''} 
          onChange={handleChange('hoursSpent')}
        />
      </Grid>
    </Grid>
  );
};