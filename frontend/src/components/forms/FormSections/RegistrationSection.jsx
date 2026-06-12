import React from 'react';
import { TextField, MenuItem, Grid, IconButton, Button } from '@mui/material';
import { inputStyle } from '../../Registration/RegistrationStyles';
import { REGIONS } from './constants';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const RegistrationSection = ({ formData, setFormData }) => {
    // 1. Инициализация экспертов
    const experts = formData.experts || [{ name: '' }];

    // 2. Логика управления экспертами
    const handleExpertChange = (index, value) => {
        const newExperts = [...experts];
        newExperts[index].name = value;
        setFormData((prev) => ({ ...prev, experts: newExperts }));
    };

    const addExpert = () => {
        setFormData((prev) => ({ ...prev, experts: [...experts, { name: '' }] }));
    };

    const removeExpert = (index) => {
        const newExperts = experts.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, experts: newExperts }));
    };

    // 3. Общая логика изменения полей
    const handleChange = (field) => (event) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    return (
        <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                required
                    fullWidth label="Дата поступления" type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={formData.date || ''}
                    onChange={handleChange('date')}
                    sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                required
                    fullWidth label="№ у/д, Куи, ЕРДР, адм.материала, гр.дела"
                    value={formData.ud || ''}
                    onChange={handleChange('ud')}
                    sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                required
                    fullWidth label="Фабула" multiline rows={2}
                    value={formData.fabula || ''}
                    onChange={handleChange('fabula')}
                    sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    fullWidth label="№ Статьи"
                    value={formData.state || ''}
                    onChange={handleChange('state')}
                    sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    fullWidth label="Вид экспертизы (код)"
                    value={formData.view || ''}
                    onChange={handleChange('view')}
                    sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    select fullWidth label="Статус экспертизы"
                    value={formData.statys || ''}
                    onChange={handleChange('statys')}
                    sx={inputStyle}
                >
                    <MenuItem value={1}>Первичная</MenuItem>
                    <MenuItem value={2}>Повторная</MenuItem>
                    <MenuItem value={3}>Дополнительная</MenuItem>
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    select fullWidth label="Тип экспертизы"
                    value={formData.typeExpertise || ''}
                    onChange={handleChange('typeExpertise')}
                    sx={inputStyle}
                >
                    <MenuItem value={1}>Комиссионная</MenuItem>
                    <MenuItem value={2}>Комплексная</MenuItem>
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    select fullWidth label="Категория дел"
                    value={formData.category || ''}
                    onChange={handleChange('category')}
                    sx={inputStyle}
                >
                    <MenuItem value={1}>Уголовное</MenuItem>
                    <MenuItem value={2}>Гражданское</MenuItem>
                    <MenuItem value={3}>Административное</MenuItem>
                </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                required
                    select fullWidth label="Орган, назначивший экспертизу"
                    value={formData.organCode || ''}
                    onChange={handleChange('organCode')}
                    sx={inputStyle}
                >
                    <MenuItem value="01">Суды</MenuItem>
                    <MenuItem value="02">Прокуратура</MenuItem>
                    <MenuItem value="03">ОВД</MenuItem>
                    <MenuItem value="04">КНБ</MenuItem>
                    <MenuItem value="05">МДГС</MenuItem>
                    <MenuItem value="06">КДГ</MenuItem>
                    <MenuItem value="07">ВСД</MenuItem>
                    <MenuItem value="08">Адвокатура</MenuItem>
                    <MenuItem value="09">Следственный суд</MenuItem>
                    <MenuItem value="10">Прочие</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                required
                    fullWidth
                    label="Наименование органа"
                    value={formData.organName || ''}
                    onChange={handleChange('organName')}
                    sx={inputStyle}
                    placeholder="Введите полное наименование..."
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                required
                    select fullWidth
                    label="Регион, назначивший экспертизу"
                    value={formData.region || ''}
                    onChange={handleChange('region')}
                    sx={inputStyle}
                >
                    {REGIONS.map((region) => (
                        <MenuItem key={region.id} value={region.id}>
                            {region.id} - {region.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    select fullWidth label="Категория сложности"
                    value={formData.complexity || ''}
                    onChange={handleChange('complexity')}
                    sx={inputStyle}
                >
                    <MenuItem value={1}>Простая</MenuItem>
                    <MenuItem value={2}>Средней степени сложности</MenuItem>
                    <MenuItem value={3}>Сложная</MenuItem>
                    <MenuItem value={4}>Особо сложная</MenuItem>
                </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    fullWidth label="Кол-во поставленных вопросов" type="number"
                    value={formData.kolvo || ''}
                    onChange={handleChange('kolvo')}
                    sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                required
                    fullWidth label="Кол-во объектов" type="number"
                    value={formData.kolvoobj || ''}
                    onChange={handleChange('kolvoobj')}
                    sx={inputStyle}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                required
                    fullWidth
                    label="Ф.И.О. лица, назначившего экспертизу"
                    value={formData.appointingPerson || ''}
                    onChange={handleChange('appointingPerson')}
                    sx={inputStyle}
                    placeholder="Введите Фамилию Имя Отчество"
                />
            </Grid>
            {/* Список экспертов */}
            {experts.map((expert, index) => (
                <Grid size={{ xs: 12 }} key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                    required
                        fullWidth
                        label={`Ф.И.О. эксперта ${index + 1}`}
                        value={expert.name}
                        onChange={(e) => handleExpertChange(index, e.target.value)}
                        sx={inputStyle}               
                    />
                    {experts.length > 1 && (
                        <IconButton onClick={() => removeExpert(index)} color="error">
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
                <Button startIcon={<AddIcon />} onClick={addExpert} variant="outlined" size="small">
                    Добавить эксперта
                </Button>
            </Grid>

        </Grid>
    );
};