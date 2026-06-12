// src/pages/Admin/AdminStyles.js
import styled from 'styled-components';
import { Box, Button } from '@mui/material';

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
    background: transparent; 
    border-radius: 20px; 
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    overflow: hidden; 
    min-height: 400px; 
    height: 650px; 
    display: flex;
    flex-direction: column;
    `;

// Кнопка основного действия (как в LoginPage)
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

// Стиль заголовка модального окна в тон с общей темой
export const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
  margin-bottom: 24px;
`;

// Аккуратная "серая" кнопка отмены
export const GreyButton = styled(Button)`
  color: #64748b !important;
  text-transform: none !important;
  font-weight: 500 !important;
  padding: 10px 20px !important;
  border-radius: 12px !important;
  margin-right: 12px !important;
  &:hover { 
    background-color: #f1f5f9 !important; 
    color: #1e293b !important;
  }
`;