import * as yup from 'yup';

// Login form validation schema
export const loginSchema = yup.object({
  email: yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Password should be at least 8 characters long')
    .required('Password is required'),
});

// Register form validation schema
export const registerSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .max(50, 'Name cannot be more than 50 characters'),
  email: yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Password should be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Forgot password validation schema
export const forgotPasswordSchema = yup.object({
  email: yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

// Reset password validation schema
export const resetPasswordSchema = yup.object({
  password: yup.string()
    .min(8, 'Password should be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Change password validation schema
export const changePasswordSchema = yup.object({
  currentPassword: yup.string()
    .required('Current password is required'),
  newPassword: yup.string()
    .min(8, 'New password should be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'New password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .notOneOf([yup.ref('currentPassword')], 'New password must be different from current password')
    .required('New password is required'),
  confirmNewPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm new password is required'),
});