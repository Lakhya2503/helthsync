import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  CalendarToday as EventIcon,
  Article as NewsIcon,
  Chat as ConsultationIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const MobileMenu = ({
  open,
  onClose,
  user,
  onLogout,
  onSearch,
  searchTerm,
  onNewConsultation,
  onNewEvent,
  onNewNews,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '80%',
          maxWidth: 300,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header with user info */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={user.avatar} alt={user.name} sx={{ mr: 2 }} />
            <Typography variant="subtitle1">{user.name}</Typography>
          </Box>
        )}

        {/* Search field */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearch('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 1 }} />

        {/* Menu items */}
        <List>
          <ListItem button onClick={onNewConsultation}>
            <ListItemIcon>
              <ConsultationIcon />
            </ListItemIcon>
            <ListItemText primary="New Consultation" />
          </ListItem>

          <ListItem button onClick={onNewEvent}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="New Event" />
          </ListItem>

          <ListItem button onClick={onNewNews}>
            <ListItemIcon>
              <NewsIcon />
            </ListItemIcon>
            <ListItemText primary="New News" />
          </ListItem>
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Logout */}
        <List>
          <ListItem button onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileMenu;