import styled from 'styled-components';
import { Box, Button } from '@mui/material';

// Основной цвет текста для заголовков 
const primaryTextColor = '#1e3a8a';

export const AdminContainer = styled(Box)`
  background: radial-gradient(circle at 0% 0%, rgba(46, 142, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
              #ffffff;
  min-height: 100vh;
  width: 100%; 
  padding: 0;
  box-sizing: border-box;
`;

export const HeaderRow = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  /* Градиентный текст */
  background: linear-gradient(135deg, #2e8eff 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const TableWrapper = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px; 
  box-shadow: 0 20px 40px -10px rgba(46, 142, 255, 0.15);
  overflow: hidden; 
  min-height: 400px; 
  height: 650px; 
  display: flex;
  flex-direction: column;
`;

export const ActionButton = styled(Button)`
  background: linear-gradient(135deg, #2e8eff 0%, #8b5cf6 100%) !important;
  color: #ffffff !important;
  border-radius: 13px !important;
  text-transform: none !important;
  padding: 10px 24px !important;
  font-weight: 600 !important;
  transition: 0.3s !important;
  box-shadow: 0 4px 12px rgba(46, 142, 255, 0.3) !important;

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0 6px 16px rgba(46, 142, 255, 0.4) !important;
  }
`;

export const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${primaryTextColor};
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(46, 142, 255, 0.1);
  margin-bottom: 24px;
`;

export const GreyButton = styled(Button)`
  color: #64748b !important;
  text-transform: none !important;
  font-weight: 500 !important;
  padding: 10px 20px !important;
  border-radius: 12px !important;
  margin-right: 12px !important;
  &:hover { 
    background-color: #f1f5f9 !important; 
    color: ${primaryTextColor} !important;
  }
`;