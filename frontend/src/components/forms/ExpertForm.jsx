import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise'; // Убедитесь в правильности пути
import * as S from './ExpertStyles';
import * as AdminS from '../../pages/Admin/AdminStyles';

export const ExpertForm = ({ initialData, onSave, onClose, isManager = false }) => {
  const [formData, setFormData] = useState(initialData || { 
    date: '', ud: '', fabula: '', state: '', category: '', 
    dateend: '', result: '', cost: '', kolvohour: '', 
    fioexpert: '', kolvo: '', kolvoobj: '', plomba: '',
    status: EXPERTISE_STATUSES.NEW.label // Убедимся, что статус инициализирован
  });
  
  const [tab, setTab] = useState(0);
  const [isNewRecord] = useState(!initialData);

  // Проверка: завершена ли экспертиза
  const isCompleted = formData.status === EXPERTISE_STATUSES.COMPLETED.label;

  const registrationFields = [
    'date', 'ud', 'fabula', 'state', 'view', 'statys', 
    'typeExpertise', 'category', 'organCode', 'organName', 
    'region', 'complexity', 'kolvo', 'kolvoobj', 'appointingPerson'
  ];

  const isRegistrationComplete = () => registrationFields.every(field => 
    formData[field]?.toString().trim() !== ''
  );

  const handleTabChange = (event, newValue) => {
    if (isNewRecord && newValue > 0 && !isRegistrationComplete()) {
      alert('Сначала заполните обязательные поля');
      return;
    }
    setTab(newValue);
  };

  const handleSave = () => {
    if (isNewRecord && !isRegistrationComplete()) {
      alert('Заполните обязательные поля');
      return;
    }
    onSave(formData);
    if (onClose) onClose();
  };

  return (
    <S.FormContainer>
      <S.CustomTabs>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Регистрация" />
          <Tab label="Ход производства" disabled={isNewRecord} />
          <Tab label="Результаты" disabled={isNewRecord} />
        </Tabs>
      </S.CustomTabs>

      <S.SectionWrapper>
        {tab === 0 && (
          <RegistrationSection 
            formData={formData} 
            setFormData={setFormData} 
            isManager={isManager} 
          />
        )}
        {tab === 1 && !isNewRecord && (
          <ProcessSection 
            formData={formData} 
            setFormData={setFormData} 
            isManager={isManager} 
          />
        )}
        {tab === 2 && !isNewRecord && (
          <ClosingSection 
            formData={formData} 
            setFormData={setFormData} 
            onSave={onSave} 
            isManager={isManager} 
          />
        )}
      </S.SectionWrapper>

      {/* Кнопка видна только если это НЕ менеджер И экспертиза НЕ завершена */}
      {!isManager && !isCompleted && (
        <Box sx={{ display: 'flex', mt: 1, pt: 1, borderTop: '1px solid #eee' }}>
          <AdminS.ActionButton variant="contained" size="small" fullWidth onClick={handleSave}>
            {isNewRecord ? 'Сохранить' : 'Изменить'}
          </AdminS.ActionButton>
        </Box>
      )}
    </S.FormContainer>
  );
};