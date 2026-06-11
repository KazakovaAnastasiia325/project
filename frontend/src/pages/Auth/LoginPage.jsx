import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Checkbox, FormControlLabel, Link, Box } from '@mui/material';
import { SplitLayout, BrandingSide, FormSide, ContentOverlay } from './AuthStyles';
import { InputWrapper, StyledTextField, GradientButton, ButtonInner } from './StyledInput';
import SoftAurora from '../../components/AuroraBackground/SoftAurora';

export const LoginPage = () => {
  // Состояние для хранения введенных данных
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Обновление состояния при вводе
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Отправка POST-запроса на бэкенд
      const response = await axios.post('/api/login', formData);
      console.log('Успешный ответ сервера:', response.data);
      
      // Здесь будет логика сохранения токена и редиректа, например:
      // localStorage.setItem('token', response.data.token);
      // window.location.href = '/admin';
      
    } catch (error) {
      console.error('Ошибка входа:', error.response?.data?.message || 'Ошибка сети');
      alert('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitLayout>
      <BrandingSide>
        <SoftAurora speed={0.6} scale={1.5} color1="#f7f7f7" color2="#e100ff" enableMouseInteraction />
        <ContentOverlay>
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
              label="Email" 
              name="email" 
              variant="outlined" 
              value={formData.email} 
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