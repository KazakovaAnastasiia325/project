import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

// Контейнер формы
export const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgb(247, 245, 245)',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
}));

export const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: '#cbd5e1',
    },
    '&:hover fieldset': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#334155',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
  },
};

// Стилизация вкладок (Tabs)
export const CustomTabs = styled(Box)({
  borderBottom: '1px solid #e2e8f0',
  marginBottom: '24px',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '15px',
    color: '#475569',
    '&.Mui-selected': {
      color: '#0f172a',
    },
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#0f172a',
  },
});

// Стили для секций формы
export const SectionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  minHeight: '300px',
}));