import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, IconButton, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as S from './AdminStyles';

const requiredLabelStyle = {
    '& .MuiInputLabel-asterisk': {
        color: '#d76666',
        fontWeight: 'bold',
        fontSize: '1.2rem'
    }
};

export const Users = () => {
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('myUsers');
        return saved ? JSON.parse(saved) : [
            { id: 1, lastName: 'Петров', firstName: 'Иван', middleName: 'Иванович', role: 'Администратор', email: 'test@mail.ru', login: 'ivanov', phone: '+77777777777', password: '123' }
        ];
    });

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ lastName: '', firstName: '', middleName: '', role: '', email: '', phone: '', login: '', password: '' });

    const updateUsers = (updatedList) => {
        setUsers(updatedList);
        localStorage.setItem('myUsers', JSON.stringify(updatedList));
    };

    const handleOpen = (user = null) => {
        if (user) {
            setEditingUser(user);
            setNewUser(user);
        } else {
            setEditingUser(null);
            setNewUser({ lastName: '', firstName: '', middleName: '', role: '', email: '', phone: '', login: '', password: '' });
        }
        setOpen(true);
    };

    const handleSave = () => {
        if (!newUser.lastName || !newUser.firstName || !newUser.login || !newUser.password || !newUser.role) {
            alert('Заполните обязательные поля: Фамилия, Имя, Логин, Пароль, Роль');
            return;
        }
        const fullName = `${newUser.lastName} ${newUser.firstName[0]}.${newUser.middleName ? ' ' + newUser.middleName[0] + '.' : ''}`;
        const userToSave = { ...newUser, fio: fullName };

        if (editingUser) {
            updateUsers(users.map(u => u.id === editingUser.id ? { ...userToSave, id: u.id } : u));
        } else {
            updateUsers([...users, { ...userToSave, id: Date.now() }]);
        }
        setOpen(false);
    };

    const columns = [
        { field: 'fio', headerName: 'ФИО', flex: 1.5 },
        { field: 'role', headerName: 'Роль', flex: 2 },
        { field: 'login', headerName: 'Логин', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Телефон', flex: 1 },
        {
            field: 'actions', headerName: 'Действия', width: 120,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" onClick={() => handleOpen(params.row)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => updateUsers(users.filter(u => u.id !== params.row.id))}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Управление пользователями</Typography>
                <S.ActionButton variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Добавить пользователя</S.ActionButton>
            </Box>

            <Paper sx={{ p: 0, height: 450, borderRadius: '12px', overflow: 'hidden' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    disableRowSelectionOnClick
                    rowHeight={55}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f9f9fa !important', borderBottom: '2px solid #e2e8f0 !important' },
                        '& .MuiDataGrid-columnHeader': { backgroundColor: '#f6f6f6 !important', color: '#0f172a !important', fontWeight: '700 !important', borderRight: '1px solid #e2e8f0' },
                        '& .MuiDataGrid-cell': { borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', color: '#475569', padding: '0 16px' },
                        '& .MuiDataGrid-row:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
                        '& .MuiDataGrid-row:hover': { backgroundColor: '#f0f4f8 !important', cursor: 'pointer' },
                    }}
                />
            </Paper>

            {/* Модальное окно */}
            <Dialog 
    open={open} 
    onClose={() => setOpen(false)} 
    maxWidth="sm" 
    fullWidth
    PaperProps={{
        sx: { borderRadius: '20px', p: 1, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
    }}
>
    <DialogTitle>
        <S.ModalTitle>{editingUser ? 'Редактирование пользователя' : 'Новый пользователь'}</S.ModalTitle>
    </DialogTitle>
    
    <DialogContent sx={{ pt: 0 }}>
        <Grid container spacing={2}>
            {/* Поля ввода с кастомным стилем */}
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
                        value={newUser[field.key]} 
                        onChange={(e) => setNewUser({ ...newUser, [field.key]: e.target.value })}
                        required={field.required !== false}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': { borderColor: '#cbd5e1' },
                                '&:hover fieldset': { borderColor: '#94a3b8' },
                            }
                        }}
                    />
                </Grid>
            ))}
            
            <Grid size={{ xs: 12 }}>
                <TextField 
                    required select fullWidth label="Роль" 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                >
                    <MenuItem value="Админ">Админ</MenuItem>
                    <MenuItem value="Сотрудник">Сотрудник</MenuItem>
                    <MenuItem value="Руководитель">Руководитель</MenuItem>
                </TextField>
            </Grid>
        </Grid>
    </DialogContent>

    <DialogActions sx={{ p: 3, pt: 1 }}>
        <S.GreyButton onClick={() => setOpen(false)}>Отмена</S.GreyButton>
        <S.ActionButton onClick={handleSave} sx={{ px: 4 }}>Сохранить</S.ActionButton>
    </DialogActions>
</Dialog>
        </Box>
    );
};