import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' }, // Спокойный синий
    background: { default: '#f8fafc' }, // Очень светлый серый для фона
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
  },
});