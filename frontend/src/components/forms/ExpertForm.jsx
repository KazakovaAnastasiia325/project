import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise';
import * as S from './ExpertStyles';
import * as AdminS from '../../pages/Admin/AdminStyles';

export const ExpertForm = ({ initialData, onSave, onClose, isManager = false }) => {
  const [formData, setFormData] = useState(initialData || { 
    date: '', ud: '', fabula: '', state: '', category: '', 
    dateend: '', result: '', cost: '', kolvohour: '', 
    fioexpert: '', kolvo: '', kolvoobj: '', plomba: '',
    status: EXPERTISE_STATUSES.NEW.label 
  });
  
  const [tab, setTab] = useState(0);
  const [isNewRecord] = useState(!initialData);

  const isCompleted = formData.status === EXPERTISE_STATUSES.COMPLETED.label;

  const registrationFields = [
    'date', 'ud', 'fabula', 'state', 'view', 'statys', 
    'typeExpertise', 'category', 'organCode', 'organName', 
    'region', 'complexity', 'kolvo', 'kolvoobj', 'appointingPerson'
  ];

  const isRegistrationComplete = () => registrationFields.every(field => 
    formData[field]?.toString().trim() !== ''
  );

  // Функция-трансформатор: переводит поля React-формы в JSON для Go
  const prepareDataForServer = (data) => {
    return {
      id: data.id || 0,
      creator_id: 1, // ЗАГЛУШКА: подставьте ID текущего пользователя
      data_post: data.date || "",
      fab: data.fabula || "",
      adm_material: 1, // ЗАГЛУШКА
      nom_statyi: data.ud || "",
      vid_exp: 1, // ЗАГЛУШКА
      organ: data.organCode || "Не указан",
      name_organ: data.organName || "Не указан",
      name_naznch: data.appointingPerson || "Не указан",
      second_name_naznch: "Фамилия", // Добавьте это поле в секцию регистрации, если нужно
      patronymic_naznch: null,
      
      experts: data.fioexpert ? [{ id: 0, name: data.fioexpert, second_name: "Изм.", patronymic: "" }] : [],

      question_count: Number(data.kolvo) || 0,
      object_count: Number(data.kolvoobj) || 0,
      
      is_closed: data.status === EXPERTISE_STATUSES.COMPLETED.label,
      stat_id: 1, // ЗАГЛУШКА
      category_id: 1, // ЗАГЛУШКА
      region_id: 1, // ЗАГЛУШКА
      iz_nix_id: 1, // ЗАГЛУШКА
      diff_cat_id: 1 // ЗАГЛУШКА
    };
  };

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
    
    // Преобразуем данные перед отправкой
    const payload = prepareDataForServer(formData);
    
    console.log("Отправляем на бэк:", payload);
    onSave(payload);
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
          <RegistrationSection formData={formData} setFormData={setFormData} isManager={isManager} />
        )}
        {tab === 1 && !isNewRecord && (
          <ProcessSection formData={formData} setFormData={setFormData} isManager={isManager} />
        )}
        {tab === 2 && !isNewRecord && (
          <ClosingSection formData={formData} setFormData={setFormData} onSave={onSave} isManager={isManager} />
        )}
      </S.SectionWrapper>

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