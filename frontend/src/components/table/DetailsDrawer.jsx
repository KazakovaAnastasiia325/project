import { Drawer, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ExpertForm } from '../Forms/ExpertForm';

export const DetailsDrawer = ({ open, onClose, data }) => (
  <Drawer 
    anchor="right" 
    open={open} 
    onClose={onClose}
    PaperProps={{ sx: { width: '60%', minWidth: 400 } }} // Занимает 60% экрана
  >
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">
        {data ? `Редактирование: №${data.id}` : 'Создание экспертизы'}
      </Typography>
      <IconButton onClick={onClose}><CloseIcon /></IconButton>
    </Box>
    
    <Box sx={{ p: 2 }}>
      <ExpertForm initialData={data} />
    </Box>
  </Drawer>
);