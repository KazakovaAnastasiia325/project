import React from 'react';

import { Grid, TextField, Divider, Typography } from '@mui/material';
import { inputStyle, sectionHeaderStyle } from '../../Registration/RegistrationStyles';
import { EXPERTISE_STATUSES } from '../../../data/mockExpertise';
import api from '../../../api/axiosConfig';
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
          disabled={isLocked}
          size="small" fullWidth label="Срок производства экспертизы, установленный нач.тер подразделения (в днях)" type="number"
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
          size="small" fullWidth label="Дата приостановления" type="date"
          slotProps={{ inputLabel: { shrink: true } }} value={formData.stop_date || ''}
          onChange={handleChange('stop_date')} sx={inputStyle}
        />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth label="Дата возобновления" type="date"
          slotProps={{ inputLabel: { shrink: true } }} value={formData.resumeDate || ''}
          onChange={handleChange('resumeDate')} sx={inputStyle}
        />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth label="Причина приостановления" value={formData.suspendReason || ''}
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


    </Grid>
  );
};