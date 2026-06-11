import React, { useState } from 'react';
import { Box, Tabs, Tab, Button } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';

export const ExpertForm = ({ initialData, onSave, onClose }) => {
  // Инициализируем состояние данными из initialData (если они есть)
  const [formData, setFormData] = useState(initialData || { 
    date: '', ud: '', fabula: '', state: '', category: '', 
    dateend: '', result: '', cost: '', kolvohour: '', fioexpert: '', kolvo: '', kolvoobj: '', plomba: '' 
  });

  const [tab, setTab] = useState(0);

  const handleSave = () => {
    onSave(formData);
    if (onClose) onClose();
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Регистрация" />
        <Tab label="Ход производства" />
        <Tab label="Результаты" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && <RegistrationSection formData={formData} setFormData={setFormData} />}
        {tab === 1 && <ProcessSection formData={formData} setFormData={setFormData} />}
        {tab === 2 && <ClosingSection formData={formData} setFormData={setFormData} />}
      </Box>

      <Button variant="contained" fullWidth onClick={handleSave} sx={{ mt: 3 }}>
        {initialData ? 'Сохранить изменения' : 'Добавить запись'}
      </Button>
    </Box>
  );
};