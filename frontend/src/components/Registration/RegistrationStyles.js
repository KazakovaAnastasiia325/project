export const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '13px',
    backgroundColor: '#ffffff',
    color: '#334155', // Текст внутри поля — спокойный темно-серый
    '& fieldset': {
      borderColor: '#cbd5e1', // Светлее рамка, чтобы не давила
      transition: '0.3s'
    },
    '&:hover fieldset': { borderColor: '#94a3b8' },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6', // Синий акцент при фокусе
      borderWidth: '2px'
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b', // Цвет лейбла в покое (светло-серый)
    fontSize: '0.85rem',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3b82f6', // Синий цвет лейбла при фокусе
    fontWeight: 600
  },
};

export const gridContainerProps = {
  container: true,
  spacing: 3,
  sx: { mt: 1 }
};
export const sectionHeaderStyle = {
  mt: 3,
  mb: 2,
  color: '#3b82f6', // Синий акцент
  fontWeight: 700,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    width: '4px',
    height: '16px',
    backgroundColor: '#3b82f6',
    marginRight: '10px',
    borderRadius: '2px',
  }
}