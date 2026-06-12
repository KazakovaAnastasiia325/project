import React, { useState } from 'react';
import { Box, Tabs, Tab, Alert } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';
import * as S from './ExpertStyles';
import * as AdminS from '../../pages/Admin/AdminStyles';

export const ExpertForm = ({ initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState(initialData || { 
    date: '', ud: '', fabula: '', state: '', category: '', 
    dateend: '', result: '', cost: '', kolvohour: '', 
    fioexpert: '', kolvo: '', kolvoobj: '', plomba: '' 
  });
  
  const [tab, setTab] = useState(0);
  const [isNewRecord] = useState(!initialData); // Флаг: новая ли запись

  // Список полей, обязательных для регистрации
  const registrationFields = [
    'date', 'ud', 'fabula', 'state', 'view', 'statys', 
    'typeExpertise', 'category', 'organCode', 'organName', 
    'region', 'complexity', 'kolvo', 'kolvoobj', 'appointingPerson'
  ];

  const isRegistrationComplete = () => {
    return registrationFields.every(field => 
      formData[field] !== undefined && formData[field] !== null && formData[field].toString().trim() !== ''
    );
  };

  const handleTabChange = (event, newValue) => {
    if (isNewRecord && newValue > 0 && !isRegistrationComplete()) {
      alert('Сначала заполните все обязательные поля в разделе "Регистрация"');
      return;
    }
    setTab(newValue);
  };

  const handleSave = () => {
    if (isNewRecord && !isRegistrationComplete()) {
      alert('Пожалуйста, заполните все обязательные поля в разделе "Регистрация"');
      return;
    }
    onSave(formData);
    if (onClose) onClose();
  };

  const handleFinish = () => {
    // Валидация раздела результатов
    const closingFields = ['dateend', 'result', 'daysInUnit', 'daysWithExpert', 'conclCategorical', 'conclProbable', 'conclNPV', 'hoursSpent'];
    const isClosingValid = closingFields.every(field => formData[field] && formData[field].toString().trim() !== '');

    if (!isClosingValid) {
      alert('Заполните все поля в разделе результатов перед завершением!');
      return;
    }
    
    onSave({ ...formData, status: 'Завершена' });
    if (onClose) onClose();
  };

  return (
    <S.FormContainer>
      <S.CustomTabs>
        <Tabs 
          value={tab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Регистрация" />
          <Tab label="Ход производства" disabled={isNewRecord} />
          <Tab label="Результаты" disabled={isNewRecord} />
        </Tabs>
      </S.CustomTabs>

      <S.SectionWrapper>
        {tab === 0 && <RegistrationSection formData={formData} setFormData={setFormData} inputStyle={S.inputStyle} />}
        {tab === 1 && !isNewRecord && <ProcessSection formData={formData} setFormData={setFormData} inputStyle={S.inputStyle} />}
        {tab === 2 && !isNewRecord && <ClosingSection formData={formData} setFormData={setFormData} inputStyle={S.inputStyle} />}
      </S.SectionWrapper>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <AdminS.ActionButton variant="contained" fullWidth onClick={handleSave}>
          {isNewRecord ? 'Сохранить регистрацию' : 'Сохранить изменения'}
        </AdminS.ActionButton>
        
        {tab === 2 && !isNewRecord && (
          <AdminS.ActionButton variant="contained" color="success" onClick={handleFinish} sx={{ backgroundColor: '#2e7d32 !important' }}>
            Завершить
          </AdminS.ActionButton>
        )}
      </Box>
    </S.FormContainer>
  );
};