import React from 'react';
import { Grid, TextField } from '@mui/material';

export const ProcessSection = ({ data }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}><TextField fullWidth label="Ф.И.О. эксперта" defaultValue={data?.fioexpert} /></Grid>
    <Grid item xs={6}><TextField fullWidth label="Кол-во вопросов" type="number" defaultValue={data?.kolvo} /></Grid>
    <Grid item xs={6}><TextField fullWidth label="Кол-во объектов" type="number" defaultValue={data?.kolvoobj} /></Grid>
    <Grid item xs={12}><TextField fullWidth label="Примечание (№ пломбы)" defaultValue={data?.plomba} /></Grid>
  </Grid>
);