import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import LoginForm from '../features/auth/components/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          Welcome Back
        </Typography>
        
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;