import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name should be at least 2 characters')
    .max(50, 'Name cannot be more than 50 characters'),
  
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const loginSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  
  password: yup.string()
    .required('Password is required'),
});