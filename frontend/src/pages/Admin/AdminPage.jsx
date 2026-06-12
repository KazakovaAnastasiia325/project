import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import AddIcon from '@mui/icons-material/Add';
import * as S from './AdminStyles';

// Начальные данные, если localStorage пуст
const initialMockData = [
  { id: 1, date: '2026-06-10', fioexpert: 'Иванов И.И.', status: 'В работе', fabula: 'Кража', ud: '12345/2026', organ: 'ОВД', result: 'В производстве' },
  { id: 2, date: '2026-06-09', fioexpert: 'Петров П.П.', status: 'Создано', fabula: 'ДТП', ud: '67890/2026', organ: 'Суды', result: 'Ожидает' }
];

export const AdminPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem('expertiseData');
    return savedRows ? JSON.parse(savedRows) : initialMockData;
  });

  useEffect(() => {
    localStorage.setItem('expertiseData', JSON.stringify(rows));
  }, [rows]);

  const handleCreate = () => {
    setSelectedExpertise(null);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (params) => {
    setSelectedExpertise(params.row);
    setIsDrawerOpen(true);
  };

  const handleSave = (newData) => {
    if (selectedExpertise) {
      setRows((prev) => prev.map((r) => (r.id === newData.id ? newData : r)));
    } else {
      const newRow = { 
        ...newData, 
        id: rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1,
        status: 'Создано' 
      };
      setRows((prev) => [...prev, newRow]);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <S.AdminContainer>
      <Container maxWidth="xl">
        <S.HeaderRow>
          <S.Title>Реестр экспертиз</S.Title>
          <S.ActionButton startIcon={<AddIcon />} onClick={handleCreate}>
            Добавить экспертизу
          </S.ActionButton>
        </S.HeaderRow>
        
        <S.TableWrapper>
          <DataGridTable 
            rows={rows} 
            onRowClick={handleRowClick} 
            onDelete={handleDelete} 
          />
        </S.TableWrapper>

        <DetailsDrawer 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          data={selectedExpertise}
          onSave={handleSave} 
        />
      </Container>
    </S.AdminContainer>
  );
};