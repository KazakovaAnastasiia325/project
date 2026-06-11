export const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '13px',
    backgroundColor: '#ffffff',
    '& fieldset': { 
      borderColor: '#e2e8f0',
      transition: '0.3s' 
    },
    '&:hover fieldset': { borderColor: '#1a1a1a' },
    '&.Mui-focused fieldset': { 
      borderColor: '#1a1a1a',
      borderWidth: '2px' 
    },
  },
  '& .MuiInputLabel-root.Mui-focused': { 
    color: '#1a1a1a',
    fontWeight: 600 
  },
};

export const gridContainerProps = {
  container: true,
  spacing: 3, // Больше "воздуха" между полями
  sx: { mt: 1 }
};