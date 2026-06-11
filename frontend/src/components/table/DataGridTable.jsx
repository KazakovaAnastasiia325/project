import React from 'react';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
  { field: 'id', headerName: '№', width: 80, headerAlign: 'center', align: 'center' },
  { field: 'date', headerName: 'Дата', flex: 0.8 },
  { field: 'fioexpert', headerName: 'Эксперт', flex: 1.2 },
  { field: 'status', headerName: 'Статус', flex: 1 },
  { field: 'fabula', headerName: 'Фабула', flex: 2 },
];

export const DataGridTable = ({ rows, onRowClick }) => (
  <DataGrid 
    rows={rows} 
    columns={columns}
    onRowClick={onRowClick}
    disableRowSelectionOnClick
    rowHeight={55}
    sx={{
      height: '100%',
      border: 'none',
      
      // Стилизация самой полосы заголовков
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#f1f5f9 !important',
        borderBottom: '2px solid #e2e8f0 !important',
      },

      // Стилизация каждой ячейки заголовка (это самый важный селектор!)
      '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#f1f5f9 !important',
        color: '#0f172a !important',
        fontWeight: '700 !important',
        fontSize: '14px !important',
        borderRight: '1px solid #e2e8f0',
      },

      // Чередование цветов СТОЛБЦОВ
      '& .MuiDataGrid-cell:nth-of-type(even)': {
        backgroundColor: '#f8fafc',
      },
      '& .MuiDataGrid-cell:nth-of-type(odd)': {
        backgroundColor: '#ffffff',
      },

      // Разлиновка ячеек
      '& .MuiDataGrid-cell': {
        borderRight: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
        color: '#475569',
        padding: '0 16px',
        '&:last-child': { borderRight: 'none' },
      },

      '& .MuiDataGrid-row:hover': {
        backgroundColor: '#f0f4f8 !important',
        cursor: 'pointer',
      },

      '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
        borderBottom: 'none',
      },
    }}
  />
);