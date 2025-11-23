import { Card, CardContent, Typography, Divider } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import type { UserInfo } from '../types/user.types';

interface AddressCardProps {
  userInfo: UserInfo;
}

export const AddressCard = ({ userInfo }: AddressCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 1 }} />
          Address
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1">{userInfo.address.street}</Typography>
        <Typography variant="body1">
          {userInfo.address.city}, {userInfo.address.state} {userInfo.address.zipCode}
        </Typography>
        <Typography variant="body1">{userInfo.address.country}</Typography>
      </CardContent>
    </Card>
  );
};
