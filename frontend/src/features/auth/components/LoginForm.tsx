import { useState, FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} data-testid="auth-login-form">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} data-testid="auth-login-form-error">
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        data-testid="auth-login-form-username"
        inputProps={{ 'data-testid': 'auth-login-form-username-input' }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        data-testid="auth-login-form-password"
        inputProps={{ 'data-testid': 'auth-login-form-password-input' }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
        data-testid="auth-login-form-submit"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </Box>
  );
};
