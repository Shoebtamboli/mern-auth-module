import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { changePasswordSchema } from '../validation';
import { authApi } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const ChangePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);
        
        // Call API to change password
        await authApi.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        });
        
        setSuccess(true);
        
        // Reset form
        formik.resetForm();
        
        // After successful password change, log the user out after 3 seconds
        // This is a security best practice to force re-login with new password
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to change password. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Change Password
      </Typography>

      {success ? (
        <Box mt={3}>
          <Alert severity="success">
            Your password has been successfully changed! You will be logged out shortly to re-login with your new password.
          </Alert>
        </Box>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Enter your current password and choose a new password.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Current Password"
            type="password"
            id="currentPassword"
            autoComplete="current-password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
            helperText={formik.touched.currentPassword && formik.errors.currentPassword}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            autoComplete="new-password"
            value={formik.values.confirmNewPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmNewPassword && Boolean(formik.errors.confirmNewPassword)}
            helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ChangePasswordForm;