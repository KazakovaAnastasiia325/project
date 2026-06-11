import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import { mockExpertise } from '../../data/mockExpertise';
import AddIcon from '@mui/icons-material/Add';
import * as S from './AdminStyles';

export const AdminPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  // Инициализируем состояние: сначала смотрим в localStorage, если там пусто - берем моки
  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem('expertiseData');
    return savedRows ? JSON.parse(savedRows) : mockExpertise;
  });

  // Эффект: сохраняем данные в localStorage при каждом изменении rows
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
      // Редактирование существующей записи
      setRows((prev) => prev.map((r) => (r.id === newData.id ? newData : r)));
    } else {
      // Добавление новой записи
      const newRow = { 
        ...newData, 
        id: rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1, // Безопасная генерация ID
        status: 'Новая' 
      };
      setRows((prev) => [...prev, newRow]);
    }
    setIsDrawerOpen(false);
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
          <DataGridTable rows={rows} onRowClick={handleRowClick} />
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