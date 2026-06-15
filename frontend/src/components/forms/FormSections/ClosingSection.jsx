import React from 'react';
import { Grid, TextField, MenuItem, Typography, Divider, Button } from '@mui/material';

import { inputStyle, sectionHeaderStyle } from '../../Registration/RegistrationStyles';
import { EXPERTISE_STATUSES } from '../../../data/mockExpertise';

// Добавляем isManager в пропсы
export const ClosingSection = ({ formData, setFormData, errors = {}, onSave, isManager = false }) => {
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

  const handleComplete = () => {
    // В случае менеджера эта функция даже не должна вызываться, 
    // но на всякий случай оставляем проверку
    if (isLocked) return;

    const requiredFields = [
      'dateend', 'result', 'daysInUnit', 'daysWithExpert', 
      'conclCategorical', 'conclProbable', 'conclNPV', 'hoursSpent'
    ];
    
    const hasEmptyFields = requiredFields.some(field => !formData[field] || String(formData[field]).trim() === '');

    if (hasEmptyFields) {
      alert('Пожалуйста, заполните все обязательные поля перед завершением!');
      return;
    }

    const completedData = { ...formData, status: EXPERTISE_STATUSES.COMPLETED.label };
    setFormData(completedData);
    
    if (onSave) {
      onSave(completedData);
    }
  };

  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {/* Секция завершения */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          disabled={isLocked} // Заменяем на isLocked
          size="small" fullWidth required error={!!errors.dateend}
          label="Дата завершения" type="date" sx={inputStyle}
          slotProps={{ inputLabel: { shrink: true } }}
          value={formData.dateend || ''} onChange={handleChange('dateend')}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth required select error={!!errors.result}
          label="Результат исследования" sx={inputStyle}
          value={formData.result || ''} onChange={handleChange('result')}
        >
          <MenuItem value={1}>Заключение</MenuItem>
          <MenuItem value={2}>СНДЗ</MenuItem>
          <MenuItem value={3}>Возврат без исполнения</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>

      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>Количество дней нахождения материалов</Typography>
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth required error={!!errors.daysInUnit}
          label="Дней в подразделении" type="number" sx={inputStyle} 
          value={formData.daysInUnit || ''} onChange={handleChange('daysInUnit')}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth required error={!!errors.daysWithExpert}
          label="Дней у эксперта" type="number" sx={inputStyle} 
          value={formData.daysWithExpert || ''} onChange={handleChange('daysWithExpert')}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>Дано выводов</Typography>
      </Grid>
      
      <Grid size={{ xs: 4 }}>
        <TextField disabled={isLocked} size="small" fullWidth required error={!!errors.conclCategorical} label="Категор." type="number" sx={inputStyle} value={formData.conclCategorical || ''} onChange={handleChange('conclCategorical')} />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField disabled={isLocked} size="small" fullWidth required error={!!errors.conclProbable} label="Вероятные" type="number" sx={inputStyle} value={formData.conclProbable || ''} onChange={handleChange('conclProbable')} />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <TextField disabled={isLocked} size="small" fullWidth required error={!!errors.conclNPV} label="НПВ" type="number" sx={inputStyle} value={formData.conclNPV || ''} onChange={handleChange('conclNPV')} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField 
          disabled={isLocked}
          size="small" fullWidth required error={!!errors.hoursSpent}
          label="Кол-во часов на производство" type="number" sx={inputStyle} 
          value={formData.hoursSpent || ''} onChange={handleChange('hoursSpent')}
        />
      </Grid>

      {/* Кнопка завершения - теперь она не видна или заблокирована для менеджера */}
      {!isManager && (
        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            disabled={isLocked}
            onClick={handleComplete}
            sx={{ 
              backgroundColor: isLocked ? '#bdbdbd' : EXPERTISE_STATUSES.COMPLETED.color,
              color: '#fff',
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: isLocked ? '#bdbdbd' : '#527a55'
              }
            }}
          >
            {formData.status === EXPERTISE_STATUSES.COMPLETED.label ? 'Экспертиза завершена' : 'Завершить экспертизу'}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};