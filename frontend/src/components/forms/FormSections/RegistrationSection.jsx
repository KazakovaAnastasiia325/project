import React from 'react';
import { TextField, MenuItem, Grid, IconButton, Button, Typography } from '@mui/material';
import { inputStyle, sectionHeaderStyle } from '../../Registration/RegistrationStyles';
import { REGIONS } from './constants';
import { EXPERTISE_STATUSES } from '../../../data/mockExpertise';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Добавляем isManager в пропсы
export const RegistrationSection = ({ formData, setFormData, isManager = false }) => {
    
    // Блокируем, если экспертиза завершена ИЛИ если пользователь — менеджер
    const isLocked = (formData.status === EXPERTISE_STATUSES.COMPLETED.label) || isManager;
    const experts = formData.experts || [{ name: '' }];

    const updateStatus = (prevData) => {
        if (prevData.status === EXPERTISE_STATUSES.NEW.label) {
            return { ...prevData, status: EXPERTISE_STATUSES.IN_PROGRESS.label };
        }
        return prevData;
    };

    const handleExpertChange = (index, value) => {
        if (isLocked) return; // Блокировка изменений
        const newExperts = [...experts];
        newExperts[index].name = value;
        setFormData((prev) => updateStatus({ ...prev, experts: newExperts }));
    };

    const addExpert = () => {
        if (isLocked) return;
        setFormData((prev) => updateStatus({ ...prev, experts: [...experts, { name: '' }] }));
    };

    const removeExpert = (index) => {
        if (isLocked) return;
        const newExperts = experts.filter((_, i) => i !== index);
        setFormData((prev) => updateStatus({ ...prev, experts: newExperts }));
    };

    const handleChange = (field) => (event) => {
        if (isLocked) return;
        setFormData((prev) => updateStatus({ ...prev, [field]: event.target.value }));
    };

    return (
        <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12 }}>
                <Typography sx={sectionHeaderStyle}>Основная информация</Typography>
            </Grid>

            {/* Заменяем все disabled={isCompleted} на disabled={isLocked} */}
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                    disabled={isLocked}
                    size="small" required fullWidth label="Дата поступления" type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={formData.date || ''} onChange={handleChange('date')} sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="№ у/д, Куи, ЕРДР, адм.материала, гр.дела"
                    value={formData.ud || ''} onChange={handleChange('ud')} sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="Фабула" multiline rows={2}
                    value={formData.fabula || ''} onChange={handleChange('fabula')} sx={inputStyle}
                />
            </Grid>
            
            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="№ Статьи"
                    value={formData.state || ''} onChange={handleChange('state')} sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="Вид экспертизы (код)"
                    value={formData.view || ''} onChange={handleChange('view')} sx={inputStyle}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Typography sx={sectionHeaderStyle}>Параметры экспертизы</Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required select fullWidth label="Статус экспертизы"
                    value={formData.statys || ''} onChange={handleChange('statys')} sx={inputStyle}
                >
                    <MenuItem value={1}>Первичная</MenuItem>
                    <MenuItem value={2}>Повторная</MenuItem>
                    <MenuItem value={3}>Дополнительная</MenuItem>
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required select fullWidth label="Тип экспертизы"
                    value={formData.typeExpertise || ''} onChange={handleChange('typeExpertise')} sx={inputStyle}
                >
                    <MenuItem value={1}>Комиссионная</MenuItem>
                    <MenuItem value={2}>Комплексная</MenuItem>
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required select fullWidth label="Категория дел"
                    value={formData.category || ''} onChange={handleChange('category')} sx={inputStyle}
                >
                    <MenuItem value={1}>Уголовное</MenuItem>
                    <MenuItem value={2}>Гражданское</MenuItem>
                    <MenuItem value={3}>Административное</MenuItem>
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required select fullWidth label="Категория сложности"
                    value={formData.complexity || ''} onChange={handleChange('complexity')} sx={inputStyle}
                >
                    <MenuItem value={1}>Простая</MenuItem>
                    <MenuItem value={2}>Средней степени сложности</MenuItem>
                    <MenuItem value={3}>Сложная</MenuItem>
                    <MenuItem value={4}>Особо сложная</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required select fullWidth label="Орган, назначивший экспертизу"
                    value={formData.organCode || ''} onChange={handleChange('organCode')} sx={inputStyle}
                >
                    {['Суды', 'Прокуратура', 'ОВД', 'КНБ', 'МДГС', 'КДГ', 'ВСД', 'Адвокатура', 'Следственный суд', 'Прочие'].map((item, idx) => (
                        <MenuItem key={idx} value={String(idx + 1).padStart(2, '0')}>{item}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="Наименование органа"
                    value={formData.organName || ''} onChange={handleChange('organName')} sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required select fullWidth label="Регион"
                    value={formData.region || ''} onChange={handleChange('region')} sx={inputStyle}
                >
                    {REGIONS.map((region) => (
                        <MenuItem key={region.id} value={region.id}>{region.id} - {region.name}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="Кол-во вопросов" type="number"
                    value={formData.kolvo || ''} onChange={handleChange('kolvo')} sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="Кол-во объектов" type="number"
                    value={formData.kolvoobj || ''} onChange={handleChange('kolvoobj')} sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                    disabled={isLocked}
                    size="small" required fullWidth label="Ф.И.О. лица, назначившего экспертизу"
                    value={formData.appointingPerson || ''} onChange={handleChange('appointingPerson')} sx={inputStyle}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Typography sx={sectionHeaderStyle}>Список экспертов</Typography>
            </Grid>
            
            {experts.map((expert, index) => (
                <Grid size={{ xs: 12 }} key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        disabled={isLocked}
                        size="small" required fullWidth label={`Ф.И.О. эксперта ${index + 1}`}
                        value={expert.name} onChange={(e) => handleExpertChange(index, e.target.value)} sx={inputStyle} 
                    />
                    {/* Скрываем кнопку удаления, если isLocked */}
                    {!isLocked && experts.length > 1 && (
                        <IconButton onClick={() => removeExpert(index)} ><DeleteIcon /></IconButton>
                    )}
                </Grid>
            ))}
            
            {/* Скрываем кнопку добавления, если isLocked */}
            {!isLocked && (
                <Grid size={{ xs: 12 }}>
                    <Button 
                        startIcon={<AddIcon />} 
                        onClick={addExpert} 
                        variant="outlined" 
                        size="small"
                        disabled={isLocked}
                    >
                        Добавить эксперта
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};