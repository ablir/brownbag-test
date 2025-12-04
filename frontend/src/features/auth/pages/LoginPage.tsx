import { Container, Box, Paper, Typography } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <Container maxWidth="sm" data-testid="auth-login-page">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} data-testid="auth-login-page-icon" />
            <Typography component="h1" variant="h4" data-testid="auth-login-page-title">
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} data-testid="auth-login-page-subtitle">
              Enter any credentials to continue
            </Typography>
          </Box>

          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};
