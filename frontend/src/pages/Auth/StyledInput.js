import styled from 'styled-components';
import { TextField } from '@mui/material';

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9fafb;
  

  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    right: 0;
    top: 0;
    background: #ffffff;
    border-radius: 50%;
    filter: blur(20px);
    box-shadow: -60px 20px 20px 10px #ffffff;
    pointer-events: none;
  }
`;

export const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: transparent;
    & fieldset {
      border: 1px solid #a3a3a3;
    }
    &:hover fieldset {
      border-color: #8b5cf6;
    }
    &.Mui-focused fieldset {
      border: 2px solid #8b5cf6;
    }
  }
  & .MuiInputLabel-root {
    color: #6b7280;
  }
`;
export const GradientButton = styled.button`
  width: 100%;      
  height: 55px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s ease;
  border: none;
  background: linear-gradient(to bottom right, #2e8eff 0%, rgba(46, 142, 255, 0) 60%);
  background-color: rgba(46, 142, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  margin-top: 10px; 

  &:hover, &:focus {
    background-color: rgba(46, 142, 255, 0.7);
    box-shadow: 0 0 15px rgba(46, 142, 255, 0.4);
    outline: none;
  }
`;
export const ButtonInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 13px;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #fff;
  font-weight: 600;
  transition: 0.3s;
`;