import React, { useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const DataGridTable = ({ 
    rows, 
    rowCount, 
    loading, 
    paginationModel, 
    onPaginationModelChange, 
    onSortModelChange, 
    onRowClick, 
    onDelete, 
    isAdmin = false, 
    isManager = false 
}) => {

    const columns = useMemo(() => [
        { field: 'id', headerName: '№', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'data_post', headerName: 'Дата', width: 130 },
        { 
            field: 'experts', 
            headerName: 'Эксперт', 
            width: 220,
            // Безопасный доступ: если row.experts нет, вернем пустую строку
            valueGetter: (value, row) => {
                if (Array.isArray(row?.experts)) {
                    return row.experts.map(e => e.name).join(', ');
                }
                return '';
            }
        },
        {
            field: 'is_closed',
            headerName: 'Статус',
            width: 160,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                // Преобразуем значение в явный boolean
                const isClosed = !!params.value; 
                return (
                    <Chip
                        label={isClosed ? 'Завершено' : 'В работе'}
                        sx={{
                            backgroundColor: isClosed ? '#2e7d32' : '#1976d2',
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
        { field: 'fab', headerName: 'Фабула', flex: 1 },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 120,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                // Безопасный доступ к статусу
                const isCompleted = !!params.row?.is_closed;
                const showViewOnly = isManager || isCompleted;

                return (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton 
                            size="small" 
                            onClick={(e) => { e.stopPropagation(); onRowClick(params); }}
                        >
                            {showViewOnly ? (
                                <VisibilityIcon fontSize="small" color="primary" />
                            ) : (
                                <EditIcon fontSize="small" />
                            )}
                        </IconButton>
                        
                        {isAdmin && (
                            <IconButton 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); onDelete(params.row.id); }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                );
            }
        }
    ], [isManager, isAdmin, onRowClick, onDelete]);

    return (
        <DataGrid
            rows={rows || []} 
            columns={columns}
            rowCount={rowCount}
            // Указываем явный ID (если бэкенд шлет id, это не обязательно, но для надежности добавим)
            getRowId={(row) => row.id}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            loading={loading}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
            rowHeight={55}
            sx={{
                height: '100%',
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#e0f2fe',
                },
                '& .MuiDataGrid-columnHeader': {
                    color: '#0369a1',
                    fontWeight: 800,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                },
                '& .MuiDataGrid-cell': {
                    color: '#334155',
                },
                '& .MuiDataGrid-columnSeparator': { display: 'none' },
                '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' }
            }}
        />
    );
};