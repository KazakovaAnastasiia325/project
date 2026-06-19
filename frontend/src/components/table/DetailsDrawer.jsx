import React, { useState, useEffect } from 'react';

import { Drawer, Box, IconButton, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ExpertForm } from '../forms/ExpertForm';
import * as S from '../forms/ExpertStyles';
import api from '../../api/axiosConfig';

export const DetailsDrawer = ({ open, onClose, expertiseId, onSave, onUpdate, mode, isManager = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && expertiseId) {
      const fetchFullData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/api/expertiza/${expertiseId}`);
          setData(response.data);
        } catch (error) {
          console.error("Ошибка загрузки данных экспертизы:", error);
          setData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchFullData();
    } else if (!open) {
      setData(null);
    }
  }, [open, expertiseId]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: '60%',
            minWidth: 400,
            backgroundColor: '#f8fafc',
            borderLeft: '1px solid #e2e8f0',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          }
        }
      }}
    >
      {/* Верхняя часть (заголовок) */}
      <Box sx={{
        p: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#131924',
        borderBottom: '4px solid #3b82f6',
      }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>
          {expertiseId ? `Редактирование: №${expertiseId}` : 'Создание экспертизы'}
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Основное содержимое с лоадером */}
      <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <S.FormContainer sx={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}>
            <ExpertForm
              initialData={data}
              mode={mode}
              onSave={onSave}
              onUpdate={onUpdate}
              onClose={onClose}
              isManager={isManager}
            />
          </S.FormContainer>
        )}
      </Box>
    </Drawer>
  );
};