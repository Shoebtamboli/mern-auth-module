import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { resetPasswordSchema } from '../validation';
import { authApi } from '../../../services/api';

const ResetPasswordForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      if (!token) {
        setError('Reset token is missing');
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        
        // Call API to reset password
        await authApi.resetPassword(token, {
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reset Password
      </Typography>

      {success ? (
        <Box mt={3}>
          <Alert severity="success">
            Your password has been successfully reset! Redirecting to login...
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress size={24} />
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Enter your new password below.
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
            name="password"
            label="New Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>

          <Box mt={2}>
            <Typography variant="body2">
              Remember your password?{' '}
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                Back to Login
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ResetPasswordForm;