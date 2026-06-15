import React, { useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { EXPERTISE_STATUSES } from '../../data/mockExpertise';

export const DataGridTable = ({ rows, onRowClick, onDelete, isAdmin = false, isManager = false }) => {

    const columns = useMemo(() => [
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
                    {/* Если менеджер — только просмотр (глаз), иначе редактирование (карандаш) */}
                    <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); onRowClick(params); }}
                    >
                        {isManager ? (
                            <VisibilityIcon fontSize="small" color="primary" />
                        ) : (
                            <EditIcon fontSize="small" />
                        )}
                    </IconButton>
                    
                    {/* Удаление: доступно ТОЛЬКО администратору */}
                    {isAdmin && (
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(params.row.id); }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            )
        }
    ], [isManager, isAdmin, onRowClick, onDelete]);

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
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#e0f2fe',
                    borderBottom: '1px solid rgba(46, 142, 255, 0.2)',
                },
                '& .MuiDataGrid-columnHeader': {
                    color: '#0369a1',
                    fontWeight: 800,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    borderRight: '1px solid rgba(46, 142, 255, 0.1)',
                    '&:last-child': { borderRight: 'none' },
                },
                '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f1f5f9',
                    borderRight: '1px solid #f1f5f9',
                    color: '#334155',
                    padding: '0 16px',
                    '&:last-child': { borderRight: 'none' },
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8fafc',
                    transition: '0.2s',
                },
                '& .MuiDataGrid-columnSeparator': { display: 'none' },
                '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' }
            }}
        />
    );
};