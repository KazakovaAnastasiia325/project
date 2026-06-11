import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import { DataGridTable } from '../../components/table/DataGridTable';
import { DetailsDrawer } from '../../components/table/DetailsDrawer';
import AddIcon from '@mui/icons-material/Add';
import * as S from './AdminStyles'; // Импортируем все стили как S

export const AdminPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  const handleCreate = () => {
    setSelectedExpertise(null);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (params) => {
    setSelectedExpertise(params.row);
    setIsDrawerOpen(true);
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
          <DataGridTable onRowClick={handleRowClick} />
        </S.TableWrapper>

        <DetailsDrawer 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          data={selectedExpertise} 
        />
      </Container>
    </S.AdminContainer>
  );
};