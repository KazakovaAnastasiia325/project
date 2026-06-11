import { DataGrid } from '@mui/x-data-grid';
import { mockExpertise } from '../../data/mockExpertise';

const columns = [
  { field: 'id', headerName: '№', width: 70 },
  { field: 'date', headerName: 'Дата', width: 120 },
  { field: 'fioexpert', headerName: 'Эксперт', width: 180 },
  { field: 'status', headerName: 'Статус', width: 150 },
  { field: 'fabula', headerName: 'Фабула', width: 250 },
];

export const DataGridTable = ({ onRowClick }) => (
  <DataGrid 
    rows={mockExpertise} 
    columns={columns} 
    onRowClick={onRowClick}
    disableRowSelectionOnClick
  />
);