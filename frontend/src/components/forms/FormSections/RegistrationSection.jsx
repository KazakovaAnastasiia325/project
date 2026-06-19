import React, { useState, useEffect } from 'react';

import { TextField, MenuItem, Grid, IconButton, Button, Typography, Box, CircularProgress } from '@mui/material';
import { inputStyle, sectionHeaderStyle } from '../../Registration/RegistrationStyles';
import { EXPERTISE_STATUSES } from '../../../data/mockExpertise';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../api/axiosConfig';
const ORGAN_CODES = [
    { code: '01', label: 'Суды' },
    { code: '02', label: 'Прокуратура' },
    { code: '03', label: 'ОВД' },
    { code: '04', label: 'КНБ' },
    { code: '05', label: 'МДГС' },
    { code: '06', label: 'КДГ' },
    { code: '07', label: 'ВСД' },
    { code: '08', label: 'Адвокатура' },
    { code: '09', label: 'Следственный суд' },
    { code: '10', label: 'Прочие' },
];
export const RegistrationSection = ({ formData, setFormData, isManager = false, isLocked }) => {

    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(false);
const isValidName = (value) => {
    const regex = /^[а-яёіұүқөәңһ\s-]*$/i;
    return value === '' || regex.test(value);
};
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

    



    const updateStatus = (prevData) => {
        if (prevData.status === EXPERTISE_STATUSES.NEW.label) {
            return { ...prevData, status: EXPERTISE_STATUSES.IN_PROGRESS.label };
        }
        return prevData;
    };

    const handleExpertChange = (index, field, value) => {
        if (isLocked) return;

        setFormData((prev) => {
            // 1. Копируем массив
            const newExperts = [...(prev.experts || [])];

            // 2. Копируем объект конкретного эксперта
            newExperts[index] = {
                ...newExperts[index],
                [field]: value
            };

            // 3. Возвращаем новый объект состояния
            return updateStatus({ ...prev, experts: newExperts });
        });
    };

    const addExpert = () => {
        if (isLocked) return;
        setFormData((prev) => updateStatus({
            ...prev,
            experts: [...(prev.experts || []), { name: '', second_name: '', patronymic: '' }]
        }));
    };

    const removeExpert = (index) => {
        const currentExperts = formData.experts || [];
        if (isLocked || currentExperts.length <= 1) return;

        const newExperts = currentExperts.filter((_, i) => i !== index);
        setFormData((prev) => updateStatus({ ...prev, experts: newExperts }));
    };

    const handleChange = (field) => (event) => {
        if (isLocked) return;
        let value = event.target.value;

        // Поля, которые сервер ожидает как числа
        const numberFields = [
            'stat_id', 'category_id', 'diff_cat_id', 'region_id', 'kolvo', 'kolvoobj', 'vid_exp'
        ];

        if (numberFields.includes(field)) {
            value = value === '' ? null : Number(value);
        }

        setFormData((prev) => updateStatus({ ...prev, [field]: value }));
    };
    const expertsToDisplay = React.useMemo(() => {
        if (!formData.experts || formData.experts.length === 0) {
            return [{ name: '', second_name: '', patronymic: '' }];
        }
        return formData.experts;
    }, [formData.experts]);
    return (
        <Grid container spacing={2} sx={{ mt: 0 }}>
            {/* Основная информация */}
            <Grid size={{ xs: 12 }}><Typography sx={sectionHeaderStyle}>Основная информация</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField disabled={isLocked} size="small" required fullWidth label="Дата поступления материала" type="date"
                    slotProps={{ inputLabel: { shrink: true } }} value={formData.date || ''} onChange={handleChange('date')} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField disabled={isLocked} size="small" required fullWidth label="№ у/д, Куи, ЕРДР, адм.материала, гр.дела" type="number"
                    value={formData.adm_material || ''} onChange={handleChange('adm_material')} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12 }}><TextField disabled={isLocked} size="small" required fullWidth label="Фабула" multiline rows={2}
                value={formData.fab || ''} onChange={handleChange('fab')} sx={inputStyle} /></Grid>

            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required fullWidth label="№ Статьи"
                value={formData.nom_statyi || ''} onChange={handleChange('nom_statyi')} sx={inputStyle} /></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required fullWidth label="Вид экспертизы (код)" type="number"
                value={formData.vid_exp || ''} onChange={handleChange('vid_exp')} sx={inputStyle} /></Grid>

            {/* Параметры экспертизы */}
            <Grid size={{ xs: 12 }}><Typography sx={sectionHeaderStyle}>Параметры экспертизы</Typography></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Статус экспертизы"
                value={formData.stat_id || ''} onChange={handleChange('stat_id')} sx={inputStyle}>
                <MenuItem value={1}>Первичная</MenuItem><MenuItem value={2}>Повторная</MenuItem><MenuItem value={3}>Дополнительная</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Тип экспертизы"
                value={formData.iz_nix_id || ''} onChange={handleChange('iz_nix_id')} sx={inputStyle}>
                <MenuItem value={1}>Комиссионная</MenuItem><MenuItem value={2}>Комплексная</MenuItem><MenuItem value={3}>Единоличная</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Категория дел"
                value={formData.category_id || ''} onChange={handleChange('category_id')} sx={inputStyle}>
                <MenuItem value={1}>Уголовное</MenuItem><MenuItem value={2}>Гражданское</MenuItem><MenuItem value={3}>Административное</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 6 }}><TextField disabled={isLocked} size="small" required select fullWidth label="Категория сложности"
                value={formData.diff_cat_id || ''} onChange={handleChange('diff_cat_id')} sx={inputStyle}>
                <MenuItem value={1}>Простая</MenuItem><MenuItem value={2}>Средней степени сложности</MenuItem><MenuItem value={3}>Сложная</MenuItem><MenuItem value={4}>Особо сложная</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small"
                    required
                    select
                    fullWidth
                    label="Орган назначивший экспертизу"
                    value={formData.organCode || ''}
                    onChange={handleChange('organCode')}
                    sx={inputStyle}
                >
                    {ORGAN_CODES.map((item) => (
                        <MenuItem key={item.code} value={item.code}>
                            {item.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    disabled={isLocked}
                    size="small"
                    required
                    fullWidth
                    label="Наименование органа"
                    value={formData.organName || ''}
                    onChange={handleChange('organName')}
                    sx={inputStyle}
                />
            </Grid>
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
                    onChange={(e) => {
        if (isValidName(e.target.value)) {
            handleChange('second_name_naznch')(e);
        }
    }} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <TextField disabled={isLocked} size="small" required fullWidth label="Имя"
                    value={formData.name_naznch || ''}
                    onChange={(e) => {
        if (isValidName(e.target.value)) {
            handleChange('name_naznch')(e);
        }
    }} sx={inputStyle} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <TextField disabled={isLocked} size="small" fullWidth label="Отчество"
                    value={formData.patronymic_naznch || ''}
                    onChange={(e) => {
        if (isValidName(e.target.value)) {
            handleChange('patronymic_naznch')(e);
        }
    }} sx={inputStyle} />
            </Grid>

            {/* Блок экспертов */}
            <Grid size={{ xs: 12 }}><Typography sx={sectionHeaderStyle}>Список экспертов</Typography></Grid>
{expertsToDisplay.map((expert, index) => (
    <Grid container spacing={2} key={index} sx={{ mb: 1, alignItems: 'center' }}>
        <Grid size={{ xs: 12, sm: 4 }}>
            <TextField 
                disabled={isLocked} 
                size="small" 
                required 
                fullWidth 
                label="Фамилия" 
                value={expert.second_name || ''}
                // ИСПОЛЬЗУЕМ handleExpertChange, а не handleChange
                onChange={(e) => {
                    if (isValidName(e.target.value)) {
                        handleExpertChange(index, 'second_name', e.target.value);
                    }
                }} 
                sx={inputStyle} 
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
            <TextField 
                disabled={isLocked} 
                size="small" 
                required 
                fullWidth 
                label="Имя" 
                value={expert.name || ''}
                onChange={(e) => {
                    if (isValidName(e.target.value)) {
                        handleExpertChange(index, 'name', e.target.value);
                    }
                }} 
                sx={inputStyle} 
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField 
                disabled={isLocked} 
                size="small" 
                fullWidth 
                label="Отчество" 
                value={expert.patronymic || ''}
                onChange={(e) => {
                    if (isValidName(e.target.value)) {
                        handleExpertChange(index, 'patronymic', e.target.value);
                    }
                }} 
                sx={inputStyle} 
            />
            {!isLocked && (
                <Box sx={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                        onClick={() => removeExpert(index)} // Здесь уже корректная функция removeExpert
                        color={expertsToDisplay.length > 1 ? "error" : "default"}
                        sx={{
                            opacity: expertsToDisplay.length > 1 ? 1 : 0.3,
                            cursor: expertsToDisplay.length > 1 ? 'pointer' : 'default'
                        }}
                    >
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