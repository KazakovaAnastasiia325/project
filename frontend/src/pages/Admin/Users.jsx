import React, { useState, useEffect, memo, useRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom'; // Импорт хука
import { Box, Paper, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, IconButton, Grid, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import * as S from './AdminStyles';

const FormFields = memo(({ initialData, ref }) => {
    const [data, setData] = useState(initialData);

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
    const navigate = useNavigate(); // Инициализация
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('myUsers');
        return saved ? JSON.parse(saved) : [{ id: 1, lastName: 'Петров', firstName: 'Иван', middleName: 'Иванович', role: 'Администратор', email: 'test@mail.ru', login: 'ivanov', phone: '+77777777777', password: '123', fio: 'Петров И.И.' }];
    });

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const formRef = useRef();

    const handleLogout = () => {
        navigate('/login');
    };

    useEffect(() => {
        localStorage.setItem('myUsers', JSON.stringify(users));
    }, [users]);

    const handleOpen = (user = null) => {
        setEditingUser(user);
        setOpen(true);
    };

    const handleSave = () => {
        const formData = formRef.current.getData();
        if (!formData.lastName || !formData.firstName || !formData.login || !formData.password || !formData.role) {
            alert('Заполните обязательные поля: Фамилия, Имя, Логин, Пароль, Роль');
            return;
        }
        const fullName = `${formData.lastName} ${formData.firstName[0]}.${formData.middleName ? ' ' + formData.middleName[0] + '.' : ''}`;
        const userToSave = { ...formData, fio: fullName };

        if (editingUser) {
            setUsers((prev) => prev.map(u => u.id === editingUser.id ? { ...userToSave, id: u.id } : u));
        } else {
            setUsers((prev) => [...prev, { ...userToSave, id: Date.now() }]);
        }
        setOpen(false);
    };

    const handleDelete = (id) => setUsers((prev) => prev.filter(u => u.id !== id));

    const columns = [
        { field: 'fio', headerName: 'ФИО', flex: 1.5 },
        { field: 'role', headerName: 'Роль', flex: 2 },
        { field: 'login', headerName: 'Логин', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Телефон', flex: 1 },
        {
            field: 'actions', headerName: 'Действия', width: 120, sortable: false, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" onClick={() => handleOpen(params.row)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(params.row.id)}><DeleteIcon fontSize="small" /></IconButton>
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
                <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '16px 24px', mb: 2 }}>
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