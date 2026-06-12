import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise';

export const DataGridTable = ({ rows, onRowClick, onDelete }) => {
    const columns = [
        { field: 'id', headerName: '№', width: 80, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: 'Дата', flex: 0.8 },
        {
            field: 'fioexpert',
            headerName: 'Эксперт',
            flex: 1.2,
            valueGetter: (value, row) => row?.experts?.map(e => e.name).join(', ') || value || ''
        },
        {
            field: 'status',
            headerName: 'Статус',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const statusLabel = params.value || 'Новая';
                const statusConfig = Object.values(EXPERTISE_STATUSES || {}).find(s => s.label === statusLabel) 
                    || { label: statusLabel, color: '#757575' };
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Chip label={statusConfig.label} sx={{ backgroundColor: statusConfig.color, color: '#fff', fontWeight: 'bold', height: '24px', fontSize: '11px' }} />
                    </Box>
                );
            }
        },
        { field: 'fabula', headerName: 'Фабула', flex: 2 },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRowClick?.(params); }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete?.(params.row.id); }}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <DataGrid
            rows={rows || []}
            columns={columns}
            disableRowSelectionOnClick
            rowHeight={55}
            sx={{
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                '& .MuiDataGrid-columnHeaders': {
                    // Стиль шапки в стиле вашего градиента
                    background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%) !important',
                    borderBottom: '2px solid #e2e8f0 !important',
                },
                '& .MuiDataGrid-columnHeader': {
                    color: '#475569 !important',
                    fontWeight: '700 !important',
                    fontSize: '12px !important',
                    textTransform: 'uppercase',
                    borderRight: '1px solid #e2e8f0',
                },
                '& .MuiDataGrid-cell': {
                    borderRight: '1px solid #f1f5f9',
                    color: '#334155',
                },
                // Чередование строк
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                    backgroundColor: '#ffffff',
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: '#fcfcfd', 
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f1f5f9 !important',
                },
                
                '& .MuiDataGrid-columnSeparator': { display: 'none' },
            }}
        />
    );
};