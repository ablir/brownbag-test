import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Divider,
  Box,
} from '@mui/material';
import { Person, Email, Phone } from '@mui/icons-material';
import type { UserInfo } from '../types/user.types';

interface InfoItemProps {
  icon: typeof Email;
  label: string;
  value: string;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Icon sx={{ mr: 2, color: 'primary.main' }} />
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

interface UserProfileCardProps {
  userInfo: UserInfo;
}

export const UserProfileCard = ({ userInfo }: UserProfileCardProps) => {
  return (
    <Card data-testid="user-profile-card">
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar
          src={userInfo.avatar}
          alt={`${userInfo.firstName} ${userInfo.lastName}`}
          sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
          data-testid="user-profile-card-avatar"
        />
        <Typography variant="h5" gutterBottom data-testid="user-profile-card-name">
          {userInfo.firstName} {userInfo.lastName}
        </Typography>
        <Chip
          icon={<Person />}
          label={userInfo.username}
          color="primary"
          sx={{ mb: 2 }}
          data-testid="user-profile-card-username"
        />
        <Typography variant="body2" color="text.secondary" paragraph data-testid="user-profile-card-bio">
          {userInfo.bio}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box data-testid="user-profile-card-email">
          <InfoItem icon={Email} label="Email" value={userInfo.email} />
        </Box>
        <Box data-testid="user-profile-card-phone">
          <InfoItem icon={Phone} label="Phone" value={userInfo.phone} />
        </Box>
      </CardContent>
    </Card>
  );
};
