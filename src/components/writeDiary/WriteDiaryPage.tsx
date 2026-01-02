import React from 'react'
import axios from "axios";
import {Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress, Divider, IconButton, Tooltip, Avatar} from '@mui/material';
import {EditNote,CalendarToday,AccessTime,Save,Refresh} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { verifyToken,logOut } from '../../Service';
const WriteDiaryPage = () => {
  const [diary, setDiary] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [charCount, setCharCount] = React.useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  function formatDateIntl(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date).replace(',', '');
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!diary.trim()) {
      setError('Please write something in your diary before submitting.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let verifyTokenResult = await verifyToken();
      if (!verifyTokenResult) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }
      await axios.post('http://localhost:5000/diary', {
        content: {
          date: formatDateIntl(new Date()),
          diary: diary
        }
      });
      
      setSuccess(true);
      setDiary('');
      setCharCount(0);
      
   
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save diary entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDiary(value);
    setCharCount(value.length);
  };

  const handleClear = () => {
    setDiary('');
    setCharCount(0);
    setError(null);
  };

  

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              mr: 2,
              width: 56,
              height: 56
            }}
          >
            <EditNote fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              My Personal Diary
            </Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setSuccess(false)}
          >
            Diary entry saved successfully!
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box>
            <Button onClick={() => {
              logOut();
              navigate('/');
            }}>
              Log Out
            </Button>
          </Box>
          <TextField
            fullWidth
            multiline
            minRows={12}
            maxRows={20}
            value={diary}
            onChange={handleTextChange}
            placeholder="Dear Diary... Write your thoughts, feelings, and memories here..."
            variant="outlined"
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
                lineHeight: 1.6,
                fontFamily: "'Georgia', serif",
                '&:hover': {
                  '& fieldset': {
                    borderColor: theme.palette.primary.main,
                  }
                },
                '&.Mui-focused': {
                  '& fieldset': {
                    borderWidth: 2,
                  }
                }
              }
            }}
            inputProps={{
              style: {
                resize: 'vertical',
              }
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography 
              variant="body2" 
              color={charCount > 5000 ? 'error' : 'text.secondary'}
            >
              {charCount} / 5000 characters
              {charCount > 4500 && (
                <Typography component="span" variant="caption" color="warning.main" ml={1}>
                  ({5000 - charCount} characters remaining)
                </Typography>
              )}
            </Typography>
            
            <Box display="flex" gap={1}>
              <Tooltip title="Clear text">
                <span>
                  <IconButton
                    onClick={handleClear}
                    disabled={loading || !diary}
                    color="default"
                  >
                    <Refresh />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Tip: try to make an entry for everyday!
            </Typography>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={loading || !diary}
                startIcon={<Refresh />}
                sx={{ borderRadius: 2 }}
              >
                Clear
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !diary.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  minWidth: 120
                }}
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            ✨ Diary Writing Tips:
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" color="text.secondary">
              • Write freely without worrying about grammar or spelling
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Focus on your feelings and experiences
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Try to write at the same time each day to build a habit
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Your entries are private and secure
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box textAlign="center" mt={4}>
        <Typography variant="body2" color="text.secondary">
          {charCount === 0 ? "Start your journey of self-reflection today!" : 
           "Your thoughts are valuable. Keep writing!"}
        </Typography>
      </Box>
    </Container>
  );
}

export default WriteDiaryPage;