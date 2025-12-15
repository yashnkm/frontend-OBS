import { Box, Card, CardContent, Typography, Avatar, Grid, Chip, Divider } from '@mui/material';
import { Person, Email, Badge, VerifiedUser } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, role, isActive } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
        Profile
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{user?.username}</Typography>
              <Chip
                label={role}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{xs:12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography>{user?.id}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{xs:12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Username
                  </Typography>
                  <Typography>{user?.username}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{xs:12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <VerifiedUser color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Status
                  </Typography>
                  <Box>
                    <Chip
                      label={isActive ? 'Active' : 'Inactive'}
                      color={isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
