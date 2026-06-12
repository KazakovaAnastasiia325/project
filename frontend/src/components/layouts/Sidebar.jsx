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
      PaperProps={{
        elevation: 0, 
        sx: { borderRight: 'none', backgroundColor: 'transparent' } 
      }}
      sx={{ 
        width: 240, 
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          width: 240, 
          // Делаем фон градиента более прозрачным для эффекта стекла
          background: 'linear-gradient(to bottom right, rgba(46, 142, 255, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
          // Размытие фона за панелью
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          borderRight: 'none' 
        } 
      }}
    >
      <Box sx={{ mt: 4, px: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem 
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: '13px',
                  mb: 1,
                  cursor: 'pointer',
                  transition: '0.3s ease',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ style: { fontWeight: isActive ? 700 : 500 } }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};