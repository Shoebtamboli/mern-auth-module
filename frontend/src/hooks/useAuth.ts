import { useContext } from 'react';
import { AuthContext } from '../store/auth/AuthContext';

export const useAuth = () => useContext(AuthContext);