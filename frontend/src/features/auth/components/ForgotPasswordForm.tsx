import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { forgotPasswordSchema } from '../validation';
import { authApi } from '../../../services/api';

const ForgotPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);
        // Call API to send password reset email
        await authApi.forgotPassword(values.email);
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Forgot Password
      </Typography>

      {success ? (
        <Box mt={3}>
          <Alert severity="success">
            If an account exists with that email, we've sent instructions to reset your password.
          </Alert>
          <Box mt={3}>
            <Button
              component={RouterLink}
              to="/login"
              fullWidth
              variant="outlined"
              color="primary"
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send you instructions to reset your password.
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordForm;