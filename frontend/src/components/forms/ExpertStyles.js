import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Основной цвет текста для всего интерфейса
const MAIN_TEXT = '#334155';
const LABEL_TEXT = '#64748b';
const ACCENT_BLUE = '#3b82f6';

export const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
}));

export const CustomTabs = styled(Box)({
  borderBottom: '1px solid #e2e8f0',
  marginBottom: '20px',
  '& .MuiTab-root': {
    minHeight: '36px',
    padding: '4px 16px',
    fontSize: '14px',
    color: LABEL_TEXT,
    textTransform: 'none',
    '&.Mui-selected': {
      color: ACCENT_BLUE,
      fontWeight: 600,
    },
  },
  '& .MuiTabs-indicator': { height: '3px', backgroundColor: ACCENT_BLUE },
});

export const SectionWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '0',
});


export const sectionHeaderStyle = {
  mt: 2,
  mb: 1,
  color: ACCENT_BLUE,
  fontWeight: 700,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

export const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    height: '42px',
    backgroundColor: '#f8fafc',
    color: MAIN_TEXT,
    '& fieldset': { borderColor: '#cbd5e1' },
    '&:hover fieldset': { borderColor: '#94a3b8' },
    '&.Mui-focused fieldset': { borderColor: ACCENT_BLUE, borderWidth: '2px' },
  },
  '& .MuiInputLabel-root': {
    color: LABEL_TEXT,
    fontSize: '0.85rem',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: ACCENT_BLUE,
  }
};