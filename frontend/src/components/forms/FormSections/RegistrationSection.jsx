import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
// Используем относительный путь: выход из 2 папок (forms, FormSections) -> вход в Registration
import { inputStyle } from '../../Registration/RegistrationStyles';

export const RegistrationSection = ({ data }) => (
  <Grid container spacing={3} sx={{ mt: 1 }}> 
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Дата поступления" type="date" InputLabelProps={{ shrink: true }} defaultValue={data?.date} sx={inputStyle} />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="№ У/Д, Куи, ЕРДР" defaultValue={data?.ud} sx={inputStyle} />
    </Grid>
    <Grid item xs={12}>
      <TextField fullWidth label="Фабула" multiline rows={2} defaultValue={data?.fabula} sx={inputStyle} />
    </Grid>
    <Grid item xs={6}>
      <TextField fullWidth label="№ Статьи" defaultValue={data?.state} sx={inputStyle} />
    </Grid>
    <Grid item xs={6}>
      <TextField select fullWidth label="Категория дел" defaultValue={data?.category || ''} sx={inputStyle}>
        <MenuItem value={1}>Уголовное</MenuItem>
        <MenuItem value={2}>Гражданское</MenuItem>
        <MenuItem value={3}>Административное</MenuItem>
      </TextField>
    </Grid>
  </Grid>
);