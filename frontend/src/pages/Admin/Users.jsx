import React, { useState, useEffect, memo, useRef, useImperativeHandle } from 'react';

import { useNavigate } from 'react-router-dom'; // Импорт хука
import { Box, Paper, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, IconButton, Grid, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
//import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import * as S from './AdminStyles';
import api from '../../api/axiosConfig';
const FormFields = memo(({ initialData, ref }) => {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useImperativeHandle(ref, () => ({
        getData: () => data
    }));

    return (
        <Grid container spacing={1.5}>
            {[
                { label: 'Фамилия', key: 'lastName', xs: 4 },
                { label: 'Имя', key: 'firstName', xs: 4 },
                { label: 'Отчество', key: 'middleName', xs: 4, required: false },
                { label: 'Логин', key: 'login', xs: 6 },
                { label: 'Пароль', key: 'password', xs: 6, type: 'password' },
                { label: 'Email', key: 'email', xs: 6, required: false },
                { label: 'Телефон', key: 'phone', xs: 6, required: false }
            ].map((field) => (
                <Grid size={{ xs: field.xs }} key={field.key}>
                    <TextField
                        fullWidth
                        label={field.label}
                        type={field.type || 'text'}
                        value={data[field.key]}
                        onChange={(e) => setData(prev => ({ ...prev, [field.key]: e.target.value }))}
                        required={field.required !== false}
                        size="small"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                                sx: { fontSize: '0.90rem', transform: 'translate(14px, -9px) scale(0.85)' }
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                '& fieldset': { borderColor: '#cbd5e1' },
                                '&:hover fieldset': { borderColor: '#94a3b8' },
                                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
                            },
                            marginTop: '6px'
                        }}
                    />
                </Grid>
            ))}
            <Grid size={{ xs: 12 }}>
                <TextField
                    required
                    select
                    fullWidth
                    label="Роль"
                    size="small"
                    value={data.role}
                    onChange={(e) => setData(prev => ({ ...prev, role: e.target.value }))}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#fafafa',
                            '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' }
                        }
                    }}
                >
                    <MenuItem value="Админ">Админ</MenuItem>
                    <MenuItem value="Сотрудник">Сотрудник</MenuItem>
                    <MenuItem value="Руководитель">Руководитель</MenuItem>
                </TextField>
            </Grid>
        </Grid>
    );
});

export const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const formRef = useRef();

    const handleLogout = async () => {
        try {

            await api.post('/api/logout');
        } catch (error) {
            console.error('Ошибка при вызове logout на сервере:', error);

        } finally {
            navigate('/login');
        }
    };
    const roleMap = { 1: 'Админ', 2: 'Руководитель', 3: 'Сотрудник' };
    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users');
            const rawData = response.data.rows || response.data || [];

            const formattedUsers = rawData.map(user => {
                const lastName = user.lastName || '';
                const firstName = user.firstName ? `${user.firstName[0].toUpperCase()}.` : '';
                const middleName = user.middleName ? `${user.middleName[0].toUpperCase()}.` : '';

                return {
                    ...user,
                    fio: `${lastName} ${firstName} ${middleName}`.trim(),
                    // Добавляем преобразованное название роли
                    roleName: roleMap[user.role] || 'Неизвестно'
                };
            });

            setUsers(formattedUsers);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpen = (user = null) => {
        let userData = user ? { ...user } : { lastName: '', firstName: '', middleName: '', role: '', email: '', phone: '', login: '', password: '' };

        // Обратное преобразование роли из числа в строку для формы
        if (user && typeof user.role === 'number') {
            const roleMapReverse = { 1: 'Админ', 2: 'Руководитель', 3: 'Сотрудник' };
            userData.role = roleMapReverse[user.role] || '';
        }

        setEditingUser(userData);
        setOpen(true);
    };

    const handleSave = async () => {
        const formData = formRef.current.getData();
        const isEditing = !!editingUser?.id;

        if (!formData.lastName || !formData.login || (!isEditing && !formData.password)) {
            alert('Заполните обязательные поля (Фамилия, Логин и Пароль)');
            return;
        }

        const roleMapping = { 'Админ': 1, 'Руководитель': 2, 'Сотрудник': 3 };

        const payload = {
            ...formData,
            role: typeof formData.role === 'number' ? formData.role : roleMapping[formData.role]
        };

        // Если редактируем и пароль пустой — не отправляем его на сервер
        if (isEditing && !formData.password) {
            delete payload.password;
        }

        try {
            if (isEditing) {
                const { fio, roleName, ...cleanPayload } = payload;

                await api.put(`/api/users/${editingUser.id}`, cleanPayload);
                alert('Успешно обновлено');
            } else {
                await api.post('/api/users', payload);
                alert('Успешно создано');
            }
            setOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Ошибка:", error);
            alert(error.response?.data?.message || 'Ошибка при сохранении');
        }
    };

    //     const handleDelete = async (id) => {
    //     if (window.confirm('Удалить пользователя?')) {
    //         try {
    //             await api.delete(`/api/users/${id}`);
    //             setUsers(prev => prev.filter(u => u.id !== id));
    //         } catch (error) {
    //             alert('Ошибка удаления');
    //         }
    //     }
    // };

    const columns = [
        { field: 'fio', headerName: 'ФИО', flex: 1.5 },
        { field: 'roleName', headerName: 'Роль', flex: 2 },
        { field: 'login', headerName: 'Логин', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Телефон', flex: 1 },
        {
            field: 'actions', headerName: 'Действия', width: 120, sortable: false, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" onClick={() => handleOpen(params.row)}><EditIcon fontSize="small" /></IconButton>
                    {/* <IconButton size="small" onClick={() => handleDelete(params.row.id)}><DeleteIcon fontSize="small" /></IconButton> */}
                </Box>
            )
        }
    ];

    return (
        <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box sx={{ width: '100%', height: '50px', backgroundColor: '#131924', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>Панель администратора</Typography>
                <Button startIcon={<LogoutIcon sx={{ fontSize: '16px' }} />} sx={{ color: '#fff', fontSize: '12px', textTransform: 'none' }} onClick={handleLogout}>Выйти</Button>
            </Box>

            <Box sx={{ px: 3, pt: 0, width: '100%', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '10px', mb: 1.5, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>Реестр пользователей</Typography>
                    <S.ActionButton startIcon={<AddIcon fontSize="small" />} onClick={() => handleOpen()} size="small" sx={{ fontSize: '12px', py: 0.5 }}>Добавить пользователя</S.ActionButton>
                </Box>

                <Paper sx={{ height: 450, borderRadius: '12px', overflow: 'hidden' }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 25, page: 0 },
                            },
                        }}
                        pageSizeOptions={[25, 50, 100]}
                        disableRowSelectionOnClick
                        rowHeight={55}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e0f2fe', borderBottom: '2px solid rgba(46, 142, 255, 0.2)' },
                            '& .MuiDataGrid-columnHeader': {
                                color: '#0369a1', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase',
                                borderRight: '1px solid rgba(46, 142, 255, 0.1)', '&:last-child': { borderRight: 'none' }
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', color: '#334155',
                                '&:last-child': { borderRight: 'none' }
                            },
                            '& .MuiDataGrid-row:hover': { backgroundColor: '#f8fafc' },
                            '& .MuiDataGrid-columnSeparator': { display: 'none' }
                        }}
                    />
                </Paper>
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: { sx: { borderRadius: '20px', p: 0, overflow: 'hidden' } }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: '#1e293b', color: '#ffffff', padding: '16px 24px', mb: 2, textAlign: 'center', // Центрируем текст
                    fontWeight: 600
                }}>
                    {editingUser ? 'Редактирование пользователя' : 'Новый пользователь'}
                </DialogTitle>

                <DialogContent sx={{ pt: 0 }}>
                    {open && <FormFields ref={formRef} initialData={editingUser || { lastName: '', firstName: '', middleName: '', role: '', email: '', phone: '', login: '', password: '' }} />}
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <S.GreyButton onClick={() => setOpen(false)}>Отмена</S.GreyButton>
                    <S.ActionButton onClick={handleSave} sx={{ px: 4 }}>Сохранить</S.ActionButton>
                </DialogActions>
            </Dialog>
        </S.AdminContainer>
    );
};