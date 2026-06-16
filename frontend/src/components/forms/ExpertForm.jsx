import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise';
import * as S from './ExpertStyles';
import * as AdminS from '../../pages/Admin/AdminStyles';

export const ExpertForm = ({ initialData, onSave, onUpdate, onClose, isManager = false }) => {
  
  // 1. Превращаем JSON с бэкенда в формат для полей формы
  const parseDataFromBackend = (data) => {
    if (!data) return { 
      date: '', ud: '', fabula: '', 
      organCode: '', organName: '', 
      name_naznch: '', second_name_naznch: '', patronymic_naznch: '',
      kolvo: '', kolvoobj: '', 
      experts: [], 
      stat_id: 1, category_id: 1, region_id: 1, iz_nix_id: 1, diff_cat_id: 1,
      region_id: '',
      status: EXPERTISE_STATUSES.NEW.label 
    };

    return {
      id: data.id,
      date: data.data_post ? data.data_post.split('T')[0] : '',
      fabula: data.fab || '',
      ud: data.nom_statyi || '',
      organCode: data.organ || '',
      organName: data.name_organ || '',
      // Синхронизируем имена полей с тем, что ожидает RegistrationSection
      name_naznch: data.name_naznch || '',
      second_name_naznch: data.second_name_naznch || '',
      patronymic_naznch: data.patronymic_naznch || '',
      kolvo: data.question_count || '',
      kolvoobj: data.object_count || '',
      experts: data.experts || [],
      stat_id: data.stat_id || 1,
      category_id: data.category_id || 1,
      region_id: data.region_id ?? '',
      iz_nix_id: data.iz_nix_id || 1,
      diff_cat_id: data.diff_cat_id || 1,
      vid_exp: data.vid_exp || 1,
      status: data.is_closed ? EXPERTISE_STATUSES.COMPLETED.label : EXPERTISE_STATUSES.IN_PROGRESS.label,
    };
  };

  const [formData, setFormData] = useState(() => parseDataFromBackend(initialData));
  const [tab, setTab] = useState(0);
  useEffect(() => {
    setFormData(parseDataFromBackend(initialData));
    setTab(0); // Сбрасываем таб на первую вкладку при смене записи
  }, [initialData]);
  const isNewRecord = !initialData;

  const isCompleted = formData.status === EXPERTISE_STATUSES.COMPLETED.label;

  const registrationFields = ['date', 'ud', 'fabula', 'organCode', 'organName', 'kolvo', 'kolvoobj', 'name_naznch', 'second_name_naznch'];

  const isRegistrationComplete = () => registrationFields.every(field => 
    formData[field]?.toString().trim() !== ''
  );

  // 2. Превращаем данные формы в JSON для отправки на Go-бэкенд
  const prepareDataForServer = (data) => {
    return {
      id: data.id || 0,
      creator_id: 1,
      data_post: data.date ? data.date : "",
      fab: data.fabula || "",
      adm_material: 1,
      nom_statyi: data.ud || "",
      vid_exp: 1,
      organ: data.organCode || "",
      name_organ: data.organName || "",
      // Передаем то, что пришло из стейта формы
      name_naznch: data.name_naznch || "",
      second_name_naznch: data.second_name_naznch || "",
      patronymic_naznch: data.patronymic_naznch || "",
      experts: data.experts || [],
      question_count: Number(data.kolvo) || 0,
      object_count: Number(data.kolvoobj) || 0,
      is_closed: data.status === EXPERTISE_STATUSES.COMPLETED.label,
      stat_id: Number(data.stat_id) || 1,
      category_id: Number(data.category_id) || 1,
      region_id: Number(data.region_id) || 0,
      iz_nix_id: Number(data.iz_nix_id) || 1,
      diff_cat_id: Number(data.diff_cat_id) || 1,
      vid_exp: Number(data.vid_exp) || 1
    };
  };

  const handleTabChange = (event, newValue) => {
    if (isNewRecord && newValue > 0 && !isRegistrationComplete()) {
      alert('Сначала заполните обязательные поля');
      return;
    }
    setTab(newValue);
  };

  const handleCreate = () => {
    if (!isRegistrationComplete()) return alert('Заполните обязательные поля');
    onSave(prepareDataForServer(formData));
    if (onClose) onClose();
  };

  const handleUpdate = () => {
    onUpdate(prepareDataForServer(formData));
    if (onClose) onClose();
  };

  return (
    <S.FormContainer>
      <S.CustomTabs>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Регистрация" />
          {!isNewRecord && <Tab label="Ход производства" />}
          {!isNewRecord && <Tab label="Результаты" />}
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
          <AdminS.ActionButton variant="contained" size="small" fullWidth onClick={isNewRecord ? handleCreate : handleUpdate}>
            {isNewRecord ? 'Сохранить' : 'Изменить'}
          </AdminS.ActionButton>
        </Box>
      )}
    </S.FormContainer>
  );
};