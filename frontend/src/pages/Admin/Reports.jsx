// src/pages/Admin/Reports.jsx
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export const Reports = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Отчеты и Аналитика</Typography>
    
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Загрузка экспертов</Typography>
          <Button startIcon={<DownloadIcon />}>Скачать Excel</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Финансовый итог</Typography>
          <Button startIcon={<DownloadIcon />}>Скачать PDF</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Отчет по просрочкам</Typography>
          <Button startIcon={<DownloadIcon />}>Скачать Excel</Button>
        </CardContent>
      </Card>
    </Box>
  </Box>
);