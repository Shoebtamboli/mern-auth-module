import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import ForgotPasswordForm from '../features/auth/components/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <ForgotPasswordForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;