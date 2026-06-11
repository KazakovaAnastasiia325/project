// src/pages/Admin/AdminStyles.js
import styled from 'styled-components';
import { Box,Button } from '@mui/material';

export const AdminContainer = styled(Box)`
  background-color: #ffffff;
  min-height: 100vh;
  padding: 40px 0;
`;

export const HeaderRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 28px;
  color: #0f172a;
  font-weight: 700;
  margin: 0;
`;

export const TableWrapper = styled.div`
  background: white;
  border-radius: 20px; 
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  
  /* Важно: если мы хотим, чтобы углы были скруглены, 
     содержимое не должно "вылезать" за них */
  overflow: hidden; 
  
  /* Вместо жесткой высоты лучше задать минимум */
  min-height: 400px; 
  height: 650px; 
  display: flex;
  flex-direction: column;
`;
// Добавьте это в AdminStyles.js
export const ActionButton = styled(Button)`
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  border-radius: 13px !important;
  text-transform: none !important;
  padding: 10px 24px !important;
  font-weight: 600 !important;
  transition: 0.3s !important;
  box-shadow: none !important;

  &:hover {
    background-color: #333333 !important;
  }
`;