import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ChangePasswordForm from '../features/auth/components/ChangePasswordForm';

const ChangePasswordPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Change Your Password
        </Typography>
        <Box sx={{ mt: 4 }}>
          <ChangePasswordForm />
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePasswordPage;