import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Checkbox, FormControlLabel, Link, Box } from '@mui/material';
import { SplitLayout, BrandingSide, FormSide, ContentOverlay } from './AuthStyles';
import { InputWrapper, StyledTextField, GradientButton, ButtonInner } from './StyledInput';
import SoftAurora from '../../components/AuroraBackground/SoftAurora';
import LogoImage from '../../assets/logo.png';

// Настройка axios (можно вынести в отдельный файл, но для одного компонента сойдет здесь)
const api = axios.create({
  baseURL: 'http://localhost:8080', // Укажите порт вашего Go сервера
  withCredentials: true,
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Отправка POST-запроса
      // Убедитесь, что ваш LoginHandler в Go ожидает JSON с полями login и password
      const response = await api.post('/api/login', formData);
      
      // Предполагаем, что ответ сервера: { "token": "...", "role": "admin" }
      const {role } = response.data;
      
      if (!role) {
        throw new Error('Некорректный ответ от сервера');
      }

      // Сохраняем данные для PrivateRoute
      
      localStorage.setItem('userRole', role);
      
      // Перенаправление по ролям
      switch (role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'manager':
          navigate('/manager', { replace: true });
          break;
        case 'employee':
          navigate('/employee', { replace: true });
          break;
        default:
          alert('Неизвестная роль пользователя');
          navigate('/login');
      }
      
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert(error.response?.data?.message || 'Ошибка авторизации. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitLayout>
      <BrandingSide>
        <SoftAurora speed={0.6} scale={1.5} color1="#f7f7f7" color2="#e100ff" enableMouseInteraction />
        <ContentOverlay>
          <Box sx={{ mb: 4 }}>
            <img src={LogoImage} alt="Logo" style={{ width: '180px', height: 'auto', display: 'block' }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
              Добро пожаловать
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Система управления данными
            </Typography>
          </Box>
        </ContentOverlay>
      </BrandingSide>

      <FormSide>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>Вход</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>Введите данные учетной записи</Typography>

          <InputWrapper>
            <StyledTextField 
              fullWidth 
              label="Логин" 
              name="login" 
              variant="outlined" 
              value={formData.login} 
              onChange={handleChange} 
              required 
            />
          </InputWrapper>
          <InputWrapper>
            <StyledTextField 
              fullWidth 
              label="Пароль" 
              name="password" 
              type="password" 
              variant="outlined" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </InputWrapper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <FormControlLabel control={<Checkbox />} label="Запомнить меня" />
            <Link href="#" underline="hover">Забыли пароль?</Link>
          </Box>

          <GradientButton type="submit" disabled={loading}>
            <ButtonInner>
              {loading ? 'Загрузка...' : 'Войти в систему'}
            </ButtonInner>
          </GradientButton>
        </Box>
      </FormSide>
    </SplitLayout>
  );
};