import { Box, Typography, Card, CardContent, Button, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import * as S from './AdminStyles'; // Предполагаем, что S.AdminContainer там есть

export const Reports = () => (
  <S.AdminContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    {/* Верхняя панель */}
    <Box sx={{ 
        width: '100%', 
        height: '50px', 
        backgroundColor: '#131924', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: 3, 
        color: '#fff', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        mb: 2 
    }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
         
        </Typography>
        <Button 
            startIcon={<LogoutIcon sx={{ fontSize: '16px' }} />} 
            sx={{ color: '#fff', fontSize: '12px', textTransform: 'none' }} 
            onClick={() => console.log('Выход')}
        >
            Выйти
        </Button>
    </Box>

    {/* Основной контент */}
    <Box sx={{ px: 3, pt: 0, width: '100%', flexGrow: 1 }}>
        {/* Заголовок раздела */}
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#1e293b', 
            padding: '8px 16px', 
            borderRadius: '10px', 
            mb: 3, 
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)' 
        }}>
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                Отчеты и Аналитика
            </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {[
                { title: 'Загрузка экспертов', type: 'Excel' },
                { title: 'Финансовый итог', type: 'PDF' },
                { title: 'Отчет по просрочкам', type: 'Excel' }
            ].map((report, index) => (
                <Card key={index} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', color: '#1e293b' }}>
                            {report.title}
                        </Typography>
                        <Button 
                            variant="outlined" 
                            startIcon={<DownloadIcon />}
                            size="small"
                            sx={{ 
                                textTransform: 'none', 
                                borderRadius: '8px',
                                borderColor: '#2563eb',
                                color: '#2563eb',
                                '&:hover': { backgroundColor: '#eff6ff', borderColor: '#2563eb' }
                            }}
                        >
                            Скачать {report.type}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </Box>
    </Box>
  </S.AdminContainer>
);