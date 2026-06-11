import React from 'react';
import { Grid, TextField } from '@mui/material';

export const ProcessSection = ({ formData, setFormData }) => {
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth label="Ф.И.О. эксперта" 
          value={formData.fioexpert || ''} 
          onChange={handleChange('fioexpert')} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          fullWidth label="Кол-во вопросов" type="number" 
          value={formData.kolvo || ''} 
          onChange={handleChange('kolvo')} 
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField 
          fullWidth label="Кол-во объектов" type="number" 
          value={formData.kolvoobj || ''} 
          onChange={handleChange('kolvoobj')} 
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth label="Примечание (№ пломбы)" 
          value={formData.plomba || ''} 
          onChange={handleChange('plomba')} 
        />
      </Grid>
    </Grid>
  );
};