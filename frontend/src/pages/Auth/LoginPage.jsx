import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Typography, Checkbox, FormControlLabel, Link, Box } from '@mui/material';
import { SplitLayout, BrandingSide, FormSide, ContentOverlay } from './AuthStyles';
import { InputWrapper, StyledTextField, GradientButton, ButtonInner } from './StyledInput';
import SoftAurora from '../../components/AuroraBackground/SoftAurora';
import LogoImage from '../../assets/logo.png';
import api from '../../api/axiosConfig';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
const isValidLogin = (value) => {
    const regex = /^[a-zA-Z0-9._-]*$/;
    return regex.test(value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если меняется поле логина, проверяем его содержимое
    if (name === 'login') {
      if (isValidLogin(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return; // Если ввод не прошел валидацию, просто игнорируем его
    }

    // Для пароля оставляем обычную обработку
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/login', formData);

      // Приводим роль к числу для единообразия
      const role = Number(response.data.role);

      if (!role) {
        throw new Error('Роль не получена');
      }


      // Перенаправление по числовым ролям
      switch (role) {
        case 1: // Админ
          navigate('/admin', { replace: true });
          break;
        case 2: // Менеджер
          navigate('/manager', { replace: true });
          break;
        case 3: // Сотрудник
          navigate('/employee', { replace: true });
          break;
        default:
          alert('Неизвестная роль пользователя');
          navigate('/login');
      }

    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Ошибка авторизации');
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
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>Вход</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>Введите данные учетной записи</Typography>

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