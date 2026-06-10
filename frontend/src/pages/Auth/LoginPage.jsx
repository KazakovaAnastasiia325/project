import { Typography, TextField, Button, Checkbox, FormControlLabel, Link, Box } from '@mui/material';
import { SplitLayout, BrandingSide, FormSide, ContentOverlay } from './AuthStyles';
import { InputWrapper, StyledTextField, GradientButton, ButtonInner } from './StyledInput';
import SoftAurora from '../../components/AuroraBackground/SoftAurora';
export const LoginPage = () => {
  return (
    <SplitLayout>
      {/* Левая панель */}
      <BrandingSide>
        <SoftAurora
          speed={0.6}
          scale={1.5}
          color1="#f7f7f7"
          color2="#e100ff"
          enableMouseInteraction
        />

        {/* Контент поверх фона */}
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

      {/* Правая панель с формой */}
      <FormSide>
        <Box sx={{ width: '100%', maxWidth: '400px' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>Вход</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>Введите данные учетной записи</Typography>

          <InputWrapper>
            <StyledTextField fullWidth label="Email" variant="outlined" />
          </InputWrapper>
          <InputWrapper>
            <StyledTextField fullWidth label="Пароль" type="password" variant="outlined" />
          </InputWrapper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <FormControlLabel control={<Checkbox />} label="Запомнить меня" />
            <Link href="#" underline="hover">Забыли пароль?</Link>
          </Box>

          <GradientButton type="submit">
            <ButtonInner>

              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              Войти в систему
            </ButtonInner>
          </GradientButton>
        </Box>
      </FormSide>
    </SplitLayout>
  );
};