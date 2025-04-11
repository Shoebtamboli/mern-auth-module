import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import ResetPasswordForm from '../features/auth/components/ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
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
          <ResetPasswordForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;