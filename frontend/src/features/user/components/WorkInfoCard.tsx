import { Card, CardContent, Typography, Divider, Grid, Box } from '@mui/material';
import { Work, Business } from '@mui/icons-material';
import type { UserInfo } from '../types/user.types';

interface InfoItemProps {
  icon: typeof Business;
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

interface WorkInfoCardProps {
  userInfo: UserInfo;
}

export const WorkInfoCard = ({ userInfo }: WorkInfoCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Work sx={{ mr: 1 }} />
          Work Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InfoItem icon={Business} label="Company" value={userInfo.company} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem icon={Work} label="Job Title" value={userInfo.jobTitle} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
