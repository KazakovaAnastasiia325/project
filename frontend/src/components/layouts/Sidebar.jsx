import { List, ListItem, ListItemIcon, ListItemText, Drawer, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Экспертизы', icon: <GavelIcon />, path: '/admin/expertise' },
    { text: 'Пользователи', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Отчеты', icon: <AssessmentIcon />, path: '/admin/reports' },
  ];

  return (
    <Drawer 
      variant="permanent" 
      sx={{ 
        width: 240, 
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          width: 240, 
          backgroundColor: '#1a1a1a', // Тот же цвет
          color: '#ffffff'
        } 
      }}
    >
      <Box sx={{ mt: 4, px: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem 
  key={item.text} // Удалили проп "button"
  onClick={() => navigate(item.path)}
  sx={{ 
    borderRadius: '13px',
    mb: 1,
    cursor: 'pointer', // Добавляем курсор, так как кнопки больше нет
    backgroundColor: location.pathname === item.path ? '#333333' : 'transparent',
    '&:hover': { backgroundColor: '#2a2a2a' }
  }}
>
  <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
    {item.icon}
  </ListItemIcon>
  <ListItemText primary={item.text} />
</ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};