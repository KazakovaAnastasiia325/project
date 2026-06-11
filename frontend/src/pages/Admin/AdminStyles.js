// src/pages/Admin/AdminStyles.js
import styled from 'styled-components';
import { Box,Button } from '@mui/material';

export const AdminContainer = styled(Box)`
  background-color: #f8fafc;
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
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  height: 650px;
  overflow: hidden;
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