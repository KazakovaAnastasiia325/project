import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

export const ClosingSection = ({ data }) => (
  <Grid container spacing={2}>
    {/* Везде вместо <Grid item ...> используйте явное объявление пропсов */}
    <Grid item xs={12} sm={6}>
      <TextField 
        fullWidth 
        label="Дата завершения" 
        type="date" 
        InputLabelProps={{ shrink: true }} 
        defaultValue={data?.dateend} 
      />
    </Grid>
    <Grid item xs={6}>
      <TextField select fullWidth label="Результат исследования" defaultValue={data?.result || ''}>
        <MenuItem value={1}>Заключение</MenuItem>
        <MenuItem value={2}>СНДЗ</MenuItem>
        <MenuItem value={3}>Возврат без исполнения</MenuItem>
      </TextField>
    </Grid>
    <Grid item xs={6}>
      <TextField fullWidth label="Общая стоимость" type="number" defaultValue={data?.cost} />
    </Grid>
    <Grid item xs={6}>
      <TextField fullWidth label="Трудозатраты (часы)" type="number" defaultValue={data?.kolvohour} />
    </Grid>
  </Grid>
);