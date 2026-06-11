import React from 'react';
import { TextField, MenuItem, Grid } from '@mui/material';
import { inputStyle } from '../../Registration/RegistrationStyles';

export const RegistrationSection = ({ formData, setFormData }) => {
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          fullWidth label="Дата поступления" type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={formData.date || ''}
          onChange={handleChange('date')}
          sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          fullWidth label="№ У/Д, Куи, ЕРДР" 
          value={formData.ud || ''}
          onChange={handleChange('ud')}
          sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth label="Фабула" multiline rows={2}
          value={formData.fabula || ''}
          onChange={handleChange('fabula')}
          sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          fullWidth label="№ Статьи" 
          value={formData.state || ''}
          onChange={handleChange('state')}
          sx={inputStyle} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          select fullWidth label="Категория дел" 
          value={formData.category || ''}
          onChange={handleChange('category')}
          sx={inputStyle}
        >
          <MenuItem value={1}>Уголовное</MenuItem>
          <MenuItem value={2}>Гражданское</MenuItem>
          <MenuItem value={3}>Административное</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );
};