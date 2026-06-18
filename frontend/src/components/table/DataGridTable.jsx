import React, { useMemo } from 'react';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Box, IconButton, Chip } from '@mui/material';
//import DeleteIcon from '@mui/icons-material/Delete';
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
    // onDelete, 
    isAdmin = false,
    isManager = false,
    slotProps, // 1. Убедитесь, что приняли его в аргументах
    ...props
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

                return value.toString().split('T')[0];
            }
        },
        {
            field: 'experts',
            headerName: 'Эксперты',
            width: 200,
            sortable: false,
            valueGetter: (value) => {
                if (!value || !Array.isArray(value)) return '';

                return value
                    .map(exp => {
                        const lastName = exp.second_name || '';
                        const firstNameInitial = exp.name ? `${exp.name[0]}.` : '';
                        const patronymicInitial = exp.patronymic && exp.patronymic.trim() ? `${exp.patronymic[0]}.` : '';

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
                            backgroundColor: isClosed ? '#639266' : '#aec7e1',
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

                        {/* {isAdmin && (
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(params.row.id); }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )} */}
                    </Box>
                );
            }
        }
    ], [isManager, isAdmin, onRowClick, {/* onDelete*/ }]);

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
            slotProps={slotProps}
            sx={{
    borderRadius: '12px',
    // Усиливаем основной контур таблицы
    border: '1px solid #94a3b8', 
    overflow: 'hidden',
    
    // Стиль заголовков
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#e2e8f0', 
        borderBottom: '2px solid #94a3b8', // Более четкая линия под заголовком
    },
    '& .MuiDataGrid-columnHeader': {
        color: '#1e293b',
        fontWeight: 700,
        fontSize: '12px',
        textTransform: 'uppercase',
        borderRight: '1px solid #cbd5e1', // Вертикальные границы в заголовке
        '&:last-child': { borderRight: 'none' }
    },
    
    // Стили строк
    '& .MuiDataGrid-row': {
        borderBottom: '1px solid #cbd5e1', // Более темная горизонтальная линия
        '&:hover': {
            backgroundColor: '#f8fafc', // Легкая подсветка при наведении
        },
    },
    
    // Стили ячеек
    '& .MuiDataGrid-cell': {
        borderRight: '1px solid #cbd5e1', // Более видимые вертикальные линии
        '&:last-child': { borderRight: 'none' }
    },
    
    // Пагинация (футер)
    '& .MuiDataGrid-footerContainer': {
        borderTop: '2px solid #94a3b8',
        backgroundColor: '#ffffff'
    },
    
    '& .MuiDataGrid-columnSeparator': { display: 'none' },
    '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' }
}}
        />
    );
};