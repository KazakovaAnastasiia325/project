import styled from 'styled-components';
import { Box } from '@mui/material';

export const SplitLayout = styled(Box)`
  display: flex;
  height: 100vh;
  width: 100%; 
  overflow: hidden;
  margin: 0; 
`;

// Левая часть с графикой
export const BrandingSide = styled(Box)`
  flex: 0 0 60%;
  position: relative; /* Обязательно */
  overflow: hidden;
  background: #0f172a;
`;

export const ContentOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  align-items: center;      
  padding-top: 120px;       
  z-index: 1;
  pointer-events: none; 
`;

// Правая часть с формой
export const FormSide = styled(Box)`
  flex: 0 0 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 40px;
`;