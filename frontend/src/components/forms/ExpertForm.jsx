import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise';
import * as S from './ExpertStyles';
import * as AdminS from '../../pages/Admin/AdminStyles';

export const ExpertForm = ({ initialData, onSave, onClose, isManager = false }) => {
  
  // 1. Функция: превращаем JSON с бэкенда в понятный формат для полей формы
  const parseDataFromBackend = (data) => {
    if (!data) return { 
      date: '', ud: '', fabula: '', state: '', category: '', 
      dateend: '', result: '', cost: '', kolvohour: '', 
      fioexpert: '', kolvo: '', kolvoobj: '', plomba: '',
      status: EXPERTISE_STATUSES.NEW.label 
    };

    return {
      id: data.id,
      date: data.data_post || '',
      fabula: data.fab || '',
      ud: data.nom_statyi || '',
      organCode: data.organ || '',
      organName: data.name_organ || '',
      appointingPerson: data.name_naznch || '',
      kolvo: data.question_count || '',
      kolvoobj: data.object_count || '',
      // Восстанавливаем статус из булева значения
      status: data.is_closed ? EXPERTISE_STATUSES.COMPLETED.label : EXPERTISE_STATUSES.IN_PROGRESS.label,
      // Добавьте остальные поля, если они нужны в форме
    };
  };

  const [formData, setFormData] = useState(() => parseDataFromBackend(initialData));
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

  // 2. Функция: превращаем данные формы в JSON для отправки на Go-бэкенд
  const prepareDataForServer = (data) => {
    return {
      id: data.id || 0,
      creator_id: 1, 
      data_post: data.date || "",
      fab: data.fabula || "",
      adm_material: 1,
      nom_statyi: data.ud || "",
      vid_exp: 1,
      organ: data.organCode || "",
      name_organ: data.organName || "",
      name_naznch: data.appointingPerson || "",
      experts: data.fioexpert ? [{ id: 0, name: data.fioexpert, second_name: "Изм.", patronymic: "" }] : [],
      question_count: Number(data.kolvo) || 0,
      object_count: Number(data.kolvoobj) || 0,
      is_closed: data.status === EXPERTISE_STATUSES.COMPLETED.label,
      stat_id: 1,
      category_id: 1,
      region_id: 1,
      iz_nix_id: 1,
      diff_cat_id: 1
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
    
    const payload = prepareDataForServer(formData);
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