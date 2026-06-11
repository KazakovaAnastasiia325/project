import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { RegistrationSection } from './FormSections/RegistrationSection';
import { ProcessSection } from './FormSections/ProcessSection';
import { ClosingSection } from './FormSections/ClosingSection';

export const ExpertForm = ({ initialData }) => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Регистрация" />
        <Tab label="Ход производства" />
        <Tab label="Результаты" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && <RegistrationSection data={initialData} />}
        {tab === 1 && <ProcessSection data={initialData} />}
        {tab === 2 && <ClosingSection data={initialData} />}
      </Box>
    </Box>
  );
};