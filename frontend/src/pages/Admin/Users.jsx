import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, 
  Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, fio: 'Петров И.И.', role: 'Сотрудник', email: 'test@mail.ru', login: 'ivanov', phone: '+77777777777' }
  ]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fio: '', role: '', email: '', phone: '', login: '', password: '' });

  const handleSave = () => {
    if (!newUser.login || !newUser.password || !newUser.fio) {
      alert('Заполните обязательные поля: ФИО, Логин, Пароль');
      return;
    }
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setOpen(false);
    setNewUser({ fio: '', role: '', email: '', phone: '', login: '', password: '' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Управление пользователями</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Добавить пользователя
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ФИО</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Логин</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Номер телефона</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.fio}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.login}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Модальное окно создания */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Новый пользователь</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="ФИО" required value={newUser.fio} onChange={(e) => setNewUser({...newUser, fio: e.target.value})} />
          <TextField select label="Роль" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
            <MenuItem value="Админ">Админ</MenuItem>
            <MenuItem value="Сотрудник">Сотрудник</MenuItem>
            <MenuItem value="Руководитель">Руководитель</MenuItem>
          </TextField>
          <TextField label="Логин" required value={newUser.login} onChange={(e) => setNewUser({...newUser, login: e.target.value})} />
          <TextField label="Пароль" type="password" required value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
          <TextField label="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
          <TextField label="Телефон" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};