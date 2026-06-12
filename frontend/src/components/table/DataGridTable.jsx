import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise';

export const DataGridTable = ({ rows, onRowClick, onDelete }) => {

    const columns = [
        { field: 'id', headerName: '№', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: 'Дата', width: 130 },
        { 
            field: 'fioexpert', 
            headerName: 'Эксперт', 
            width: 220,
            valueGetter: (value, row) => {
                if (row && row.experts && Array.isArray(row.experts)) {
                    return row.experts.map(e => e.name).join(', ');
                }
                return value || '';
            }
        },
        {
            field: 'status',
            headerName: 'Статус',
            width: 160,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const statusLabel = params.value || 'Новая';
                const statuses = EXPERTISE_STATUSES || {};
                const statusConfig = Object.values(statuses).find(s => s.label === statusLabel)
                    || { label: statusLabel, color: '#757575' };

                return (
                    <Chip
                        label={statusConfig.label}
                        sx={{
                            backgroundColor: statusConfig.color,
                            color: '#fff',
                            fontWeight: 'bold',
                            height: '24px',
                            fontSize: '11px',
                            borderRadius: '6px'
                        }}
                    />
                );
            }
        },
        { field: 'fabula', headerName: 'Фабула', flex: 1 },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 120,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRowClick(params); }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(params.row.id); }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <DataGrid
            rows={rows || []} 
            columns={columns}
            onRowClick={onRowClick}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
                pagination: { paginationModel: { pageSize: 50 } },
            }}
            disableRowSelectionOnClick
            rowHeight={55}
            sx={{
                height: '100%',
                border: 'none',
                // Заголовки
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                },
                '& .MuiDataGrid-columnHeader': {
                    color: '#64748b',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    // Вертикальные линии в заголовках
                    borderRight: '1px solid #e2e8f0',
                    '&:last-child': { borderRight: 'none' },
                },
                '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f1f5f9',
                    // Вертикальные линии в ячейках
                    borderRight: '1px solid #f1f5f9',
                    color: '#334155',
                    padding: '0 16px',
                    '&:last-child': { borderRight: 'none' },
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8fafc',
                    transition: '0.2s',
                },
                // Убираем лишнее
                '& .MuiDataGrid-columnSeparator': { display: 'none' },
                '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' }
            }}
        />
    );
};