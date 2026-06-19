import React, { useState, useEffect, memo, useRef, useImperativeHandle } from 'react';

import { useNavigate } from 'react-router-dom'; // Импорт хука

import { Box, Paper, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, IconButton, Grid, Typography, Button, Menu, Divider, Badge } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
//import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import * as S from './AdminStyles';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import NotificationsIcon from '@mui/icons-material/Notifications'; // И этот иконку

const FormFields = memo(({ initialData, ref }) => {
    const [data, setData] = useState(initialData);
    const isValidLogin = (value) => /^[a-zA-Z0-9._-]*$/.test(value);
const [emailPrefix, setEmailPrefix] = useState(initialData.email?.split('@')[0] || '');
    const [emailDomain, setEmailDomain] = useState(initialData.email?.includes('@') 
        ? `@${initialData.email.split('@')[1]}` 
        : '@gmail.com');
    const domains = [
        '@gmail.com', '@mail.ru', '@inbox.ru', '@list.ru', 
        '@bk.ru', '@yandex.kz', '@yandex.ru', '@mail.kz', 
        '@gov.kz', '@edu.kz', '@company.kz'
    ];
    useEffect(() => {
        setData(prev => ({ ...prev, email: `${emailPrefix}${emailDomain}` }));
    }, [emailPrefix, emailDomain]);
    
    useEffect(() => {
        setData(initialData);
        setEmailPrefix(initialData.email?.split('@')[0] || '');
        setEmailDomain(initialData.email?.includes('@') ? `@${initialData.email.split('@')[1]}` : '@gmail.com');
    }, [initialData]);

    useImperativeHandle(ref, () => ({
        getData: () => data
    }));
const handleNameChange = (e, key) => {
        const value = e.target.value;
        const regex = /^[а-яёіұүқөәңһ\s-]*$/i;
        
        if (regex.test(value)) {
            setData(prev => ({ ...prev, [key]: value }));
        }
    };
    const fetchUsers = async () => {
    try {
        const response = await api.get('/api/users');
        const rawData = response.data.rows || response.data || [];

        const formattedUsers = rawData.map(user => {
            const lastName = user.lastName || '';
            const firstName = user.firstName || '';
            const middleName = user.middleName || '';

            return {
                ...user,
                // Здесь мы просто соединяем строки как есть, без изменения регистра
                fio: `${lastName} ${firstName} ${middleName}`.trim(),
                roleName: roleMap[user.role] || 'Неизвестно'
            };
        });

        setUsers(formattedUsers);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};
    return (
        <Grid container spacing={1.5}>
            {[
                { label: 'Фамилия', key: 'lastName', xs: 4 },
                { label: 'Имя', key: 'firstName', xs: 4 },
                { label: 'Отчество', key: 'middleName', xs: 4, required: false },
                { label: 'Логин', key: 'login', xs: 6 },
                { label: 'Пароль', key: 'password', xs: 6, type: 'password' },

            ].map((field) => (
                <Grid size={{ xs: field.xs }} key={field.key}>
                    <TextField
                        fullWidth
                        autoComplete="off"
                        label={field.label}
                        type={field.type || 'text'}
                        value={data[field.key]}
                        onChange={(e) => {
        const val = e.target.value;
        
        // Проверка для имен (кириллица)
        if (['lastName', 'firstName', 'middleName'].includes(field.key)) {
            handleNameChange(e, field.key);
        } 
        // Проверка для логина (латиница, цифры, точка, подчеркивание, дефис)
        else if (field.key === 'login') {
            if (isValidLogin(val)) {
                setData(prev => ({ ...prev, login: val }));
            }
        } 
        // Остальные поля (пароль и т.д.)
        else {
            setData(prev => ({ ...prev, [field.key]: val }));
        }
    }}
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
            <Grid size={{ xs: 6 }}>
    <TextField
        fullWidth
        label="Телефон"
        size="small"
        // Отображаем +7 и отсекаем лишние символы, если они вдруг попали
        value={data.phone ? `+7${data.phone}` : '+7'}
        onChange={(e) => {
            // Убираем "+7" из значения, чтобы работать только с вводимыми цифрами
            let rawValue = e.target.value.replace('+7', '');
            
            // Оставляем только цифры
            const onlyDigits = rawValue.replace(/\D/g, '');
            
            // Ограничиваем длину до 10 символов
            if (onlyDigits.length <= 10) {
                setData(prev => ({ ...prev, phone: onlyDigits }));
            }
        }}
        placeholder="7001234567"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        // Добавляем подсказку пользователю
        slotProps={{
            inputLabel: { shrink: true }
        }}
    />
</Grid>
            <Grid size={{ xs: 6 }}>
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
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                    fullWidth
                    label="Email"
                    value={emailPrefix}
                    onChange={(e) => {
        // Разрешаем: латиницу (a-z), цифры (0-9), точку (.), подчеркивание (_) и дефис (-)
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9._-]*$/;
        
        if (regex.test(value)) {
            setEmailPrefix(value);
        }
    }}
                    size="small"
                    placeholder="user"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
                <TextField
                    select
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                    size="small"
                    sx={{ width: '40%', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                >
                    {domains.map((d) => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                    ))}
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
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const openNotif = Boolean(anchorEl);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            setNotifications(Array.isArray(res.data) ? res.data : []);
        } catch (error) { console.error('Ошибка загрузки уведомлений:', error); }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/notifications/read/${id}`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) { console.error('Ошибка:', error); }
    };

    useEffect(() => {
        fetchUsers();
        fetchNotifications();
    }, []);
    const markAllAsRead = async () => {
    try {
        await api.put('/api/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) { toast.error('Ошибка при обновлении'); }
};
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
                const firstName = user.firstName ? `${user.firstName[0]}.` : '';
                const middleName = user.middleName ? `${user.middleName[0]}.` : '';

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
    if (user) {
        // Режим редактирования: подготавливаем данные
        let userData = { ...user };
        if (typeof user.role === 'number') {
            const roleMapReverse = { 1: 'Админ', 2: 'Руководитель', 3: 'Сотрудник' };
            userData.role = roleMapReverse[user.role] || '';
        }
        setEditingUser(userData);
    } else {
        // Режим создания: обнуляем editingUser
        setEditingUser(null);
    }
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
                toast.success('Успешно обновлено');
            } else {
                await api.post('/api/users', payload);
                toast.success('Успешно создано');
            }
            setOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Ошибка:", error);
            toast.error(error.response?.data?.message || 'Ошибка при сохранении');
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
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Колокольчик */}
                    <IconButton color="inherit" onClick={handleClick}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <Menu 
    anchorEl={anchorEl} 
    open={openNotif} 
    onClose={handleClose}
    slotProps={{
        paper: {
            sx: { 
                width: 350, 
                maxHeight: 400, 
                borderRadius: '12px',
                mt: 1,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }
        }
    }}
>
    {/* Заголовок с кнопкой прочитать все */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #e2e8f0' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Уведомления</Typography>
        {unreadCount > 0 && (
            <Button size="small" onClick={() => {markAllAsRead()}} sx={{ fontSize: '11px', textTransform: 'none' }}>
                Прочитать все
            </Button>
        )}
    </Box>

    {/* Список уведомлений */}
    {notifications.length > 0 ? (
        notifications.map((n) => (
            <MenuItem 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                sx={{ 
                    whiteSpace: 'normal', 
                    py: 1.5, 
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: n.is_read ? 'transparent' : '#f0f7ff' 
                }}
            >
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: n.is_read ? 400 : 600, color: '#1e293b' }}>
                        {n.text}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {new Date(n.created_at).toLocaleString()}
                    </Typography>
                </Box>
            </MenuItem>
        ))
    ) : (
        <Box sx={{ p: 3, textAlign: 'center', color: '#94a3b8' }}>
            <NotificationsIcon sx={{ fontSize: 40, opacity: 0.3 }} />
            <Typography variant="body2">Нет новых уведомлений</Typography>
        </Box>
    )}
</Menu>

                    <Button startIcon={<LogoutIcon sx={{ fontSize: '16px' }} />} sx={{ color: '#fff', fontSize: '12px', textTransform: 'none' }} onClick={handleLogout}>
                        Выйти
                    </Button>
                </Box>
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
        pagination: { paginationModel: { pageSize: 25, page: 0 } },
    }}
    pageSizeOptions={[25, 50, 100]}
    disableRowSelectionOnClick
    rowHeight={50} // Чуть меньше для компактности
    columnHeaderHeight={45}
    sx={{
        border: 'none',
        // Заголовок таблицы
       '& .MuiDataGrid-columnHeader': {
    color: '#475569',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    // Вот здесь добавляется разлиновка между ячейками заголовка:
    borderRight: '1px solid #cbd5e1', 
    '&:last-child': {
        borderRight: 'none', // Убираем линию у последней колонки
    }
},
        // Ячейки
        '& .MuiDataGrid-cell': {
            borderRight: '1px solid #cbd5e1',
            borderBottom: '1px solid #f1f5f9',
            color: '#334155',
            fontSize: '14px',
            '&:focus': { outline: 'none' } // Убирает синюю рамку при клике
        },
        // Строки
        '& .MuiDataGrid-row': {
            transition: 'background-color 0.2s',
            '&:hover': { backgroundColor: '#f1f5f9' },
            '&.Mui-selected': { backgroundColor: '#e0f2fe !important' }
        },
        // Убираем лишние элементы
        '& .MuiDataGrid-columnSeparator': { display: 'none' },
        '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e2e8f0' }
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
    {open && (
        <FormFields 
            ref={formRef} 
            initialData={editingUser || { 
                lastName: '', firstName: '', middleName: '', 
                role: '', email: '', phone: '', login: '', password: '' 
            }} 
        />
    )}
</DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <S.GreyButton onClick={() => setOpen(false)}>Отмена</S.GreyButton>
                    <S.ActionButton onClick={handleSave} sx={{ px: 4 }}>Сохранить</S.ActionButton>
                </DialogActions>
            </Dialog>
        </S.AdminContainer>
    );
};