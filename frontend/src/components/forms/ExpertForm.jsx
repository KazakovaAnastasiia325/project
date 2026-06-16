import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Tabs, Tab } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise';
import * as S from './ExpertStyles';
import * as AdminS from '../../pages/Admin/AdminStyles';
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});
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
      name_naznch: data.name_naznch || '',
      second_name_naznch: data.second_name_naznch || '',
      patronymic_naznch: data.patronymic_naznch || '',
      kolvo: data.question_count || '',
      kolvoobj: data.object_count || '',
      deadlineDays: data.srok_exp ?? '',
      stop_date: data.stop_date ? data.stop_date.split('T')[0] : '',
      resumeDate: data.resuming_date ? data.resuming_date.split('T')[0] : '',
      suspendReason: data.stop_reason ?? '',
      laborCosts: data.expert_cost ?? '',
      materialCosts: data.material_cost ?? '',
      equipmentCosts: data.exploitation_cost ?? '',
      totalCost: data.full_cost ?? '',
      plomba: data.descrip ?? '',
      extensionDays: data.srok_resuming ?? '',
      experts: data.experts || [],
      stat_id: data.stat_id || 1,
      category_id: data.category_id || 1,
      region_id: data.region_id ?? '',
      iz_nix_id: data.iz_nix_id || 1,
      diff_cat_id: data.diff_cat_id || 1,
      vid_exp: data.vid_exp || 1,
      dateend: data.end_date ? data.end_date.split('T')[0] : '',
      result: data.exp_res_id || '',
      daysInUnit: data.day_count ?? '',
      daysWithExpert: data.exp_day_count ?? '',
      conclCategorical: data.cat_vivod ?? '',
      conclProbable: data.possible_vivod ?? '',
      conclNPV: data.impossible_vivod ?? '',
      hoursSpent: data.hour_count ?? '',
      status: data.is_closed ? EXPERTISE_STATUSES.COMPLETED.label : EXPERTISE_STATUSES.IN_PROGRESS.label,
    };
  };

  const [formData, setFormData] = useState(() => parseDataFromBackend(initialData));
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setFormData(parseDataFromBackend(initialData));
    setTab(0);
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
      name_naznch: data.name_naznch || "",
      second_name_naznch: data.second_name_naznch || "",
      patronymic_naznch: data.patronymic_naznch || "",
      experts: data.experts || [],
      question_count: Number(data.kolvo) || 0,
      object_count: Number(data.kolvoobj) || 0,
      srok_exp: Number(data.deadlineDays) || 0,
      stop_date: data.stop_date || null,
      resuming_date: data.resumeDate || null,
      stop_reason: data.suspendReason || null,
      srok_resuming: Number(data.extensionDays) || 0,
      expert_cost: Number(data.laborCosts) || 0,
      material_cost: Number(data.materialCosts) || 0,
      exploitation_cost: Number(data.equipmentCosts) || 0,
      full_cost: Number(data.totalCost) || 0,
      descrip: data.plomba || "",
      end_date: data.dateend || null,
      exp_res_id: Number(data.result) || null,
      day_count: Number(data.daysInUnit) || null,
      exp_day_count: Number(data.daysWithExpert) || null,
      cat_vivod: Number(data.conclCategorical) || null,
      possible_vivod: Number(data.conclProbable) || null,
      impossible_vivod: Number(data.conclNPV) || null,
      hour_count: Number(data.hoursSpent) || null,
      is_closed: data.status === EXPERTISE_STATUSES.COMPLETED.label,
      stat_id: Number(data.stat_id) || 1,
      category_id: Number(data.category_id) || 1,
      region_id: Number(data.region_id) || 0,
      iz_nix_id: Number(data.iz_nix_id) || 1,
      diff_cat_id: Number(data.diff_cat_id) || 1
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

 
const handleComplete = async (dataFromClosing) => {
  const dataForServer = prepareDataForServer({
    ...dataFromClosing,
    status: EXPERTISE_STATUSES.COMPLETED.label 
  });

  try {
    
    const response = await api.put(`/api/expertize/${dataForServer.id}/complete`, dataForServer);
    // Если всё успешно
    if (onUpdate) onUpdate(dataForServer); 
    if (onClose) onClose();
    alert('Экспертиза успешно завершена!');
    
  } catch (error) {
    console.error(error);
    alert('Не удалось завершить экспертизу. Проверьте соединение с сервером.');
  }
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
          <ClosingSection 
            formData={formData} 
            setFormData={setFormData} 
            onSave={handleComplete} 
            isManager={isManager} 
          />
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