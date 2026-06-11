import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

export const RegistrationSection = ({ data }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}><TextField fullWidth label="Дата поступления" type="date" InputLabelProps={{ shrink: true }} defaultValue={data?.date} /></Grid>
    <Grid item xs={12} sm={6}><TextField fullWidth label="№ У/Д, Куи, ЕРДР" defaultValue={data?.ud} /></Grid>
    <Grid item xs={12}><TextField fullWidth label="Фабула" multiline rows={2} defaultValue={data?.fabula} /></Grid>
    <Grid item xs={6}><TextField fullWidth label="№ Статьи" defaultValue={data?.state} /></Grid>
    <Grid item xs={6}>
      <TextField select fullWidth label="Категория дел" defaultValue={data?.category || ''}>
        <MenuItem value={1}>Уголовное</MenuItem>
        <MenuItem value={2}>Гражданское</MenuItem>
        <MenuItem value={3}>Административное</MenuItem>
      </TextField>
    </Grid>
    {/* Добавьте остальные поля из вашего списка (код экспертизы, регион и т.д.) */}
  </Grid>
);