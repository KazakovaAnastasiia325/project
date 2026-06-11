import { Drawer, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ExpertForm } from '../forms/ExpertForm';

export const DetailsDrawer = ({ open, onClose, data, onSave }) => (
  <Drawer 
    anchor="right" 
    open={open} 
    onClose={onClose}
    sx={{
      '& .MuiDrawer-paper': { 
        width: '60%', 
        minWidth: 400 
      }
    }}
  >
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">
        {data ? `Редактирование: №${data.id}` : 'Создание экспертизы'}
      </Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    
    <Box sx={{ p: 2 }}>
      <ExpertForm initialData={data} onSave={onSave} onClose={onClose} />
    </Box>
  </Drawer>
);