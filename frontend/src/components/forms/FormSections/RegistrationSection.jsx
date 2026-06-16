import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Grid, IconButton, Button, Typography, Box, CircularProgress } from '@mui/material';
import { inputStyle, sectionHeaderStyle } from '../../Registration/RegistrationStyles';
import { EXPERTISE_STATUSES } from '../../../data/mockExpertise';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

export const RegistrationSection = ({ formData, setFormData, isManager = false }) => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRegions = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/regions');
                setRegions(response.data);
            } catch (error) {
                console.error("Ошибка загрузки регионов:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegions();
    }, []);

    const isLocked = (formData.status === EXPERTISE_STATUSES.COMPLETED.label) || isManager;
    
    const experts = (formData.experts && formData.experts.length > 0) 
        ? formData.experts 
        : [{ name: '', second_name: '', patronymic: '' }];

    const updateStatus = (prevData) => {
        if (prevData.status === EXPERTISE_STATUSES.NEW.label) {
            return { ...prevData, status: EXPERTISE_STATUSES.IN_PROGRESS.label };
        }
        return prevData;
    };

    const handleExpertChange = (index, field, value) => {
        if (isLocked) return;
        const newExperts = [...experts];
        newExperts[index][field] = value;
        setFormData((prev) => updateStatus({ ...prev, experts: newExperts }));
    };

    const addExpert = () => {
        if (isLocked) return;
        setFormData((prev) => updateStatus({ 
            ...prev, 
            experts: [...experts, { name: '', second_name: '', patronymic: '' }] 
        }));
    };

    const removeExpert = (index) => {
        if (isLocked || experts.length <= 1) return;
        const newExperts = experts.filter((_, i) => i !== index);
        setFormData((prev) => updateStatus({ ...prev, experts: newExperts }));
    };

    const handleChange = (field) => (event) => {
        if (isLocked) return;
        let value = event.target.value;

        // Поля, которые сервер ожидает как числа
        const numberFields = [
            'statys', 'typeExpertise', 'category', 'complexity', 
            'kolvo', 'kolvoobj', 'region', 'stat_id', 'category_id', 
            'region_id', 'adm_material', 'diff_cat_id', 'vid_exp',
            'state', 'view' 
        ];

        if (numberFields.includes(field)) {
            value = value === '' ? null : Number(value);
        }

        setFormData((prev) => updateStatus({ ...prev, [field]: value }));
    };

    return (
        <Grid container spacing={2} sx={{ mt: 0 }}>
            {/* Основная информация */}
            <Grid size={{ xs: 12 }}><Typography sx={sectionHeaderStyle}>Основная информация</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField disabled={isLocked} size="small" required fullWidth label="Дата поступления" type="date"
                    slotProps={{ inputLabel: { shrink: true } }} value={formData.date || ''} onChange={handleChange('date')} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField disabled={isLocked} size="small" required fullWidth label="№ у/д, Куи, ЕРДР, адм.материала, гр.дела"
                    value={formData.ud || ''} onChange={handleChange('ud')} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12 }}><TextField disabled={isLocked} size="small" required fullWidth label="Фабула" multiline rows={2}
                    value={formData.fabula || ''} onChange={handleChange('fabula')} sx={inputStyle} /></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required fullWidth label="№ Статьи"
                    value={formData.state || ''} onChange={handleChange('state')} sx={inputStyle} /></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required fullWidth label="Вид экспертизы (код)"
                    value={formData.view || ''} onChange={handleChange('view')} sx={inputStyle} /></Grid>

            {/* Параметры экспертизы */}
            <Grid size={{ xs: 12 }}><Typography sx={sectionHeaderStyle}>Параметры экспертизы</Typography></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Статус экспертизы"
                    value={formData.statys || ''} onChange={handleChange('statys')} sx={inputStyle}>
                    <MenuItem value={1}>Первичная</MenuItem><MenuItem value={2}>Повторная</MenuItem><MenuItem value={3}>Дополнительная</MenuItem>
                </TextField></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Тип экспертизы"
                    value={formData.typeExpertise || ''} onChange={handleChange('typeExpertise')} sx={inputStyle}>
                    <MenuItem value={1}>Комиссионная</MenuItem><MenuItem value={2}>Комплексная</MenuItem>
                </TextField></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Категория дел"
                    value={formData.category || ''} onChange={handleChange('category')} sx={inputStyle}>
                    <MenuItem value={1}>Уголовное</MenuItem><MenuItem value={2}>Гражданское</MenuItem><MenuItem value={3}>Административное</MenuItem>
                </TextField></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Категория сложности"
                    value={formData.complexity || ''} onChange={handleChange('complexity')} sx={inputStyle}>
                    <MenuItem value={1}>Простая</MenuItem><MenuItem value={2}>Средней степени сложности</MenuItem><MenuItem value={3}>Сложная</MenuItem><MenuItem value={4}>Особо сложная</MenuItem>
                </TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Орган, назначивший экспертизу"
                    value={formData.organCode || ''} onChange={handleChange('organCode')} sx={inputStyle}>
                    {['Суды', 'Прокуратура', 'ОВД', 'КНБ', 'МДГС', 'КДГ', 'ВСД', 'Адвокатура', 'Следственный суд', 'Прочие'].map((item, idx) => (
                        <MenuItem key={idx} value={String(idx + 1).padStart(2, '0')}>{item}</MenuItem>
                    ))}
                </TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField disabled={isLocked} size="small" required fullWidth label="Наименование органа"
                    value={formData.organName || ''} onChange={handleChange('organName')} sx={inputStyle} /></Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField disabled={isLocked || loading} size="small" required select fullWidth label={loading ? "Загрузка..." : "Регион"}
                    value={formData.region_id || ''} onChange={handleChange('region_id')} sx={inputStyle}>
                    {loading ? (
                        <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                    ) : (
                        regions.map((region) => (
                            <MenuItem key={region.id} value={region.id}>{region.name}</MenuItem>
                        ))
                    )}
                </TextField>
            </Grid>

            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required fullWidth label="Кол-во вопросов" type="number"
                    value={formData.kolvo || ''} onChange={handleChange('kolvo')} sx={inputStyle} /></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required fullWidth label="Кол-во объектов" type="number"
                    value={formData.kolvoobj || ''} onChange={handleChange('kolvoobj')} sx={inputStyle} /></Grid>

            {/* Блок лица, назначившего экспертизу */}
            <Grid size={{ xs: 12 }}><Typography sx={sectionHeaderStyle}>Лицо, назначившее экспертизу</Typography></Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <TextField disabled={isLocked} size="small" required fullWidth label="Фамилия"
                    value={formData.second_name_naznch || ''} 
                    onChange={handleChange('second_name_naznch')} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <TextField disabled={isLocked} size="small" required fullWidth label="Имя"
                    value={formData.name_naznch || ''} 
                    onChange={handleChange('name_naznch')} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <TextField disabled={isLocked} size="small" fullWidth label="Отчество"
                    value={formData.patronymic_naznch || ''} 
                    onChange={handleChange('patronymic_naznch')} sx={inputStyle} />
            </Grid>

            {/* Блок экспертов */}
            <Grid size={{ xs: 12 }}><Typography sx={sectionHeaderStyle}>Список экспертов</Typography></Grid>
            {experts.map((expert, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 1, alignItems: 'center' }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField disabled={isLocked} size="small" required fullWidth label="Фамилия" value={expert.second_name || ''}
                            onChange={(e) => handleExpertChange(index, 'second_name', e.target.value)} sx={inputStyle} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField disabled={isLocked} size="small" required fullWidth label="Имя" value={expert.name || ''}
                            onChange={(e) => handleExpertChange(index, 'name', e.target.value)} sx={inputStyle} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField disabled={isLocked} size="small" fullWidth label="Отчество" value={expert.patronymic || ''}
                            onChange={(e) => handleExpertChange(index, 'patronymic', e.target.value)} sx={inputStyle} />
                        {!isLocked && (
                            <Box sx={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => removeExpert(index)} disabled={experts.length === 1} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            ))}
            
            {!isLocked && (
                <Grid size={{ xs: 12 }}>
                    <Button startIcon={<AddIcon />} onClick={addExpert} variant="outlined" size="small">
                        Добавить эксперта
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};