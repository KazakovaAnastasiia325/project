import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoImage from '../../assets/logo.png';
import SoftAurora from '../../components/AuroraBackground/SoftAurora';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 70;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  // Проверяем, находится ли пользователь в разделе сотрудника
  const isEmployee = location.pathname.startsWith('/employee');
  const isManager = location.pathname.startsWith('/manager');
  const isAdmin = !isEmployee && !isManager;
  // Формируем список меню динамически
  const menuItems = [
    {
      text: 'Экспертизы',
      icon: <GavelIcon />,
      path: isEmployee ? '/employee/expertise' : isManager ? '/manager/expertise' : '/admin/expertise'
    },
    // Показываем пользователей ТОЛЬКО если это админ
    ...(isAdmin ? [{ text: 'Пользователи', icon: <PeopleIcon />, path: '/admin/users' }] : []),
    
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          transition: 'width 0.3s ease',
          borderRight: 'none',
          backgroundColor: '#131924',
          color: '#ffffff',
          overflow: 'hidden',
          boxShadow: '10px 0 20px rgba(0,0,0,0.3)',
        }
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <SoftAurora color1="#1e3a8a" color2="#581c87" brightness={0.4} speed={0.2} />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Кнопка переключения */}
        <Box sx={{ display: 'flex', justifyContent: open ? 'flex-end' : 'center', p: 1 }}>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: '#fff' }}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        <Box sx={{ mt: 2, mb: 0, display: 'flex', justifyContent: 'center' }}>
          <img src={LogoImage} alt="Logo" style={{ width: open ? '70px' : '40px', transition: '0.3s' }} />
        </Box>

        <Box sx={{ mt: 4, px: 1 }}>
          <List>
            {menuItems.map((item) => {
              // Подсветка активного пункта (проверяем, входит ли текущий путь в путь пункта)
              const isActive = location.pathname.includes(item.path);

              return (
                <ListItem
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '13px',
                    mb: 1,
                    cursor: 'pointer',
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                  }}
                >
                  <ListItemIcon sx={{ color: '#ffffff', minWidth: open ? 40 : 0 }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} sx={{ opacity: 1 }} />}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};