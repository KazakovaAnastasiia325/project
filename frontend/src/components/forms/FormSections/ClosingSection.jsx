import React from 'react';
import { Grid, TextField, MenuItem, Typography, Divider, Button } from '@mui/material';

import { inputStyle, sectionHeaderStyle } from '../../Registration/RegistrationStyles';
import { EXPERTISE_STATUSES } from '../../../data/mockExpertise';

export const ClosingSection = ({ formData, setFormData, errors = {}, onSave, isManager = false }) => {
  // Блокируем поля, если экспертиза уже завершена ИЛИ если пользователь — менеджер
  const isLocked = (formData.status === EXPERTISE_STATUSES.COMPLETED.label) || isManager;

  const handleChange = (field) => (event) => {
    if (isLocked) return;
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleComplete = () => {
    if (isLocked) return;

    // 1. Простая проверка заполненности
    const requiredFields = ['dateend', 'result', 'daysInUnit', 'daysWithExpert', 'conclCategorical', 'conclProbable', 'conclNPV', 'hoursSpent'];
    const hasEmptyFields = requiredFields.some(field => !formData[field] && formData[field] !== 0);

    if (hasEmptyFields) {
      alert('Заполните все обязательные поля!');
      return;
    }

    // 2. Просто передаем текущие данные наверх
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {/* Секция завершения */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth required error={!!errors.dateend}
          label="Дата завершения исследования" type="date" sx={inputStyle}
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
        <Typography sx={sectionHeaderStyle}>Фактическое количество дней нахождения материалов</Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth required error={!!errors.daysInUnit}
          label="Дней в территориальном подразделении" type="number" sx={inputStyle}
          value={formData.daysInUnit || ''} onChange={handleChange('daysInUnit')}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth required error={!!errors.daysWithExpert}
          label="Дней у эксперта в производстве" type="number" sx={inputStyle}
          value={formData.daysWithExpert || ''} onChange={handleChange('daysWithExpert')}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>Дано выводов</Typography>
      </Grid>

      <Grid size={{ xs: 4 }}>
        <TextField disabled={isLocked} size="small" fullWidth required error={!!errors.conclCategorical} label="Категорические" type="number" sx={inputStyle} value={formData.conclCategorical || ''} onChange={handleChange('conclCategorical')} />
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
          label="Кол-во часов затраченных на производство экспертизы" type="number" sx={inputStyle}
          value={formData.hoursSpent || ''} onChange={handleChange('hoursSpent')}
        />
      </Grid>
      {/* Блок Затраты */}
      <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>
      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>Затраты</Typography>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth label="Трудозатраты эксперта" type="number"
          value={formData.laborCosts || ''} onChange={handleChange('laborCosts')} sx={inputStyle}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth label="Материальные затраты" type="number"
          value={formData.materialCosts || ''} onChange={handleChange('materialCosts')} sx={inputStyle}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth label="Расходы по эксплуатации оборудования" type="number"
          value={formData.equipmentCosts || ''} onChange={handleChange('equipmentCosts')} sx={inputStyle}
        />
      </Grid>
      

      <Grid size={{ xs: 12 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth label="Примечание (№ пломбы)" value={formData.plomba || ''}
          onChange={handleChange('plomba')} sx={inputStyle}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography sx={sectionHeaderStyle}>
          Итоговые расчеты
        </Typography>
      </Grid>

      <Grid size={{ xs: 6 }}>
        <TextField
          disabled={isLocked}
          size="small" fullWidth label="Общая стоимость исследования"
          value={formData.totalCost || ''} onChange={handleChange('totalCost')} disabled
          InputProps={{ readOnly: true }} sx={inputStyle}
        />
      </Grid>

      <Grid size={{ xs: 6 }}>
        <TextField
          size="small" fullWidth label="Стоимость с НДС"
          value={formData.totalWithVat || '0.00'}
          disabled
          InputProps={{ readOnly: true }}
          sx={inputStyle}
        />
      </Grid>

      {/* Кнопка завершения */}
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