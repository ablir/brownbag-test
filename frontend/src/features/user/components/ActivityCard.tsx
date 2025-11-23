import { Card, CardContent, Typography, Divider, Grid, Box } from '@mui/material';
import { CalendarToday, AccessTime } from '@mui/icons-material';
import type { UserInfo } from '../types/user.types';

interface InfoItemProps {
  icon: typeof CalendarToday;
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

interface ActivityCardProps {
  userInfo: UserInfo;
}

export const ActivityCard = ({ userInfo }: ActivityCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Activity
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={CalendarToday}
              label="Joined"
              value={new Date(userInfo.joinedDate).toLocaleDateString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={AccessTime}
              label="Last Login"
              value={new Date(userInfo.lastLogin).toLocaleString()}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
