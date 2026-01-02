import React from 'react'
import axios from "axios";
import {Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logOut } from '../../Service';

const WriteDiaryPage = () => {
  const [diary, setDiary] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
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

  const handleClear = () => {
    setDiary('');
    setError(null);
  };

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            My Personal Diary
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleLogout}
            sx={{ textTransform: 'none' }}
          >
            Log Out
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary" mb={2}>
          Today's Date: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Diary entry saved successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            multiline
            minRows={10}
            value={diary}
            onChange={(e) => setDiary(e.target.value)}
            placeholder="Dear Diary... Write your thoughts, feelings, and memories here..."
            variant="outlined"
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={handleClear}
              disabled={loading || !diary}
              sx={{ textTransform: 'none' }}
            >
              Clear
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !diary.trim()}
              sx={{ textTransform: 'none', px: 4 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Entry'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default WriteDiaryPage;