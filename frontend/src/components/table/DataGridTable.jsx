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
        { 
            field: 'id', 
            headerName: '№', 
            width: 70, 
            headerAlign: 'center', 
            align: 'center',
            sortable: true 
        },
        { 
            field: 'data_post', 
    headerName: 'Дата', 
    width: 130,
    sortable: true,
    valueFormatter: (value) => {
        if (!value) return '';
        // Если дата приходит как "2026-06-16T00:00:00Z", 
        // split('T')[0] оставит только "2026-06-16"
        return value.toString().split('T')[0]; 
    }
        },
        { 
            field: 'experts', 
            headerName: 'Эксперты', // Изменено на "Эксперты"
            width: 200,
            sortable: false,
            valueGetter: (value) => {
                // Безопасно проверяем, что данные пришли и это массив
                if (!value || !Array.isArray(value)) return '';

                return value
                    .map(exp => {
                        const lastName = exp.second_name || '';
                        // Берем первую букву имени, если оно есть
                        const firstNameInitial = exp.name ? `${exp.name[0]}.` : '';
                        // Берем первую букву отчества, только если оно заполнено
                        const patronymicInitial = exp.patronymic && exp.patronymic.trim() ? `${exp.patronymic[0]}.` : '';

                        // Склеиваем Фамилию и инициалы
                        return `${lastName} ${firstNameInitial}${patronymicInitial}`.trim();
                    })
                    .filter(Boolean) 
                    .join(', ');
            }
        },
        {
            field: 'is_closed',
            headerName: 'Статус',
            width: 160,
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            renderCell: (params) => {
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
        { 
            field: 'fab', 
            headerName: 'Фабула', 
            flex: 1,
            sortable: false 
        },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 120,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
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
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(params.row.id); }}>
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
            getRowId={(row) => row.id}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            loading={loading}
            sortingOrder={['asc', 'desc']}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
            rowHeight={55}
            showCellVerticalBorder
            showColumnVerticalBorder
            sx={{
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                overflow: 'hidden',
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f1f5f9',
                    borderBottom: '2px solid #cbd5e1',
                },
                '& .MuiDataGrid-columnHeader': {
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                },
                '& .MuiDataGrid-row': {
                    borderBottom: '1px solid #e2e8f0',
                },
                '& .MuiDataGrid-cell': {
                    borderRight: '1px solid #e2e8f0',
                    '&:last-child': { borderRight: 'none' }
                },
                '& .MuiDataGrid-columnSeparator': { display: 'none' },
                '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' }
            }}
        />
    );
};