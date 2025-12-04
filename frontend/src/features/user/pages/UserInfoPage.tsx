import { Container, Box, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../../auth/hooks/useAuth';
import { useUserInfo } from '../hooks/useUserInfo';
import { UserProfileCard } from '../components/UserProfileCard';
import { WorkInfoCard } from '../components/WorkInfoCard';
import { AddressCard } from '../components/AddressCard';
import { ActivityCard } from '../components/ActivityCard';

export const UserInfoPage = () => {
  const { logout } = useAuth();
  const { userInfo, loading, error } = useUserInfo();

  if (loading) {
    return (
      <Container maxWidth="lg" data-testid="user-info-page-loading">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress data-testid="user-info-page-spinner" />
        </Box>
      </Container>
    );
  }

  if (error || !userInfo) {
    return (
      <Container maxWidth="lg" data-testid="user-info-page-error">
        <Box sx={{ mt: 4 }}>
          <Typography color="error" data-testid="user-info-page-error-message">
            {error || 'User not found'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} data-testid="user-info-page">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" data-testid="user-info-page-title">User Profile</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={logout}
          data-testid="user-info-page-logout"
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <UserProfileCard userInfo={userInfo} />
        </Grid>

        {/* Details Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WorkInfoCard userInfo={userInfo} />
            </Grid>

            <Grid item xs={12}>
              <AddressCard userInfo={userInfo} />
            </Grid>

            <Grid item xs={12}>
              <ActivityCard userInfo={userInfo} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
