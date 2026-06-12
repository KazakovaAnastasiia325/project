import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      // Градиент задается через backgroundImage, так как это фон
      backgroundImage: `
        radial-gradient(circle at 0% 0%, rgba(46, 142, 255, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
      `,
      backgroundColor: '#f8fafc', 
      backgroundAttachment: 'fixed',
    }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          width: '100%' 
        }}
      >
        <Outlet /> 
      </Box>
    </Box>
  );
};