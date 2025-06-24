import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Grow,
  Card,
  CardContent,
  Grid,
  Chip,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import { 
  Add, 
  PersonAdd, 
  TrendingUp, 
  PieChart, 
  Menu as MenuIcon, 
  FilterList, 
  Search,
  Close,
  CheckCircle,
  Star,
  CalendarToday,
} from '@mui/icons-material';
import ClientTable from './ClientTable';
import ClientForm from './ClientForm';
import {
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from '../../store/clientsApi';

// Subtle animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const searchBarAppear = keyframes`
  from { 
    width: 40px; 
    opacity: 0;
    transform: translateX(20px);
  }
  to { 
    width: 300px; 
    opacity: 1;
    transform: translateX(0);
  }
`;

// Premium styled components
const PremiumContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  // Remove background color
  // background: '#FAFBFC',
  position: 'relative',
  overflowX: 'hidden',
}));

const PageContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1),  
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),  
  },
  paddingTop: 0,  
  paddingBottom: theme.spacing(1),
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  marginTop: -40, // Move header even higher up (increase negative value)
  position: 'relative',
}));

const ModernTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: '2.4rem',
  letterSpacing: '-0.025em',
  // Remove color here, will use sx prop for gradient
  marginBottom: theme.spacing(0.5),
  marginTop: 0,
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    fontSize: '2.8rem',
  },
}));

const TitleAccent = styled('span')(({ theme }) => ({
  fontWeight: 700,
  // Remove color here, will use sx prop for gradient
  position: 'relative',
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  '& .MuiGrid-container': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

const PremiumCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: '#ffffff',
  border: 'none',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const StatCard = styled(PremiumCard)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 140,
  height: '100%',
  width: '100%',
}));

const StatCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1.5),
}));

const StatCardIcon = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // Glassmorphism effect
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(8px)',
  border: `1.5px solid ${alpha(theme.palette.primary.main, 0.10)}`,
  boxShadow: '0 2px 8px 0 rgba(16,24,64,0.08)',
  color: theme.palette.primary.main,
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: -1,
    borderRadius: 'inherit',
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
    '&::before': {
      opacity: 1,
    },
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 300,
  letterSpacing: '-0.025em',
  marginBottom: theme.spacing(0.5),
  color: '#1A1A2E',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: alpha('#1A1A2E', 0.6),
  fontWeight: 500,
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  animation: `${fadeIn} 0.5s ease forwards`,
}));

const TableSection = styled(Box)(({ theme }) => ({
  animation: `${slideUp} 0.5s ease forwards`,
}));

const TableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const TableContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  border: 'none',
}));

const PremiumButton = styled(Button)(({ theme, color }) => ({
  borderRadius: 14,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  fontSize: '1rem',
  position: 'relative',
  overflow: 'hidden',
  // Set button color to requested gradient
  background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
  color: '#fff',
  border: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.2)}, transparent)`,
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #0f1629 0%, #1a2332 100%)',
    boxShadow: `0 8px 25px ${alpha('#101840', 0.35)}`,
    transform: 'translateY(-2px) scale(1.02)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px) scale(1.01)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
    transition: 'transform 0.2s ease',
  },
  '&:hover .MuiButton-startIcon': {
    transform: 'scale(1.1)',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 10,
  background: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

const PremiumDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    maxWidth: '95vw',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '80vw',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '65vw',
    },
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3, 4),
}));

const DialogBody = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const DialogFooter = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 4, 3),
}));

const LoadingState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60vh',
  gap: theme.spacing(3),
}));

const ErrorState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 3),
  display: 'flex',
  justifyContent: 'center',
}));

// TransitionComponent for Dialogs
const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SearchTextField = styled(TextField)(({ theme }) => ({
  animation: `${searchBarAppear} 0.3s ease forwards`,
  overflow: 'hidden',
  borderRadius: 12,
  width: { xs: '100%', sm: 300 },
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    height: 40,
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover, &.Mui-focused': {
      boxShadow: '0px 6px 20px rgba(16,24,64,0.15)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha('#101840', 0.18),
      borderWidth: 1.5,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha('#101840', 0.32),
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: 1.5,
      borderColor: '#101840',
    },
  },
  '& .MuiInputAdornment-root': {
    marginRight: theme.spacing(1),
  },
}));

const FilterMenu = styled(Menu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    overflow: 'hidden',
    borderRadius: 20,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
    border: `1px solid ${alpha('#101840', 0.09)}`,
    backdropFilter: 'blur(20px)',
    background: 'linear-gradient(145deg, #ffffff 0%, #fbfbff 100%)',
    minWidth: 240,
    maxWidth: 320,
  },
  '& .MuiMenuItem-root': {
    padding: theme.spacing(1.8, 2.5),
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    borderLeft: '3px solid transparent',
    '&:not(:last-child)': {
      borderBottom: `1px solid ${alpha('#e5e7eb', 0.6)}`,
    },
    '&:hover': {
      backgroundColor: alpha('#101840', 0.04),
    },
    '&.Mui-selected': {
      backgroundColor: alpha('#101840', 0.03),
      borderLeft: `3px solid #101840`,
      '&:hover': {
        backgroundColor: alpha('#101840', 0.05),
      }
    }
  },
  '& .MuiList-root': {
    padding: 0,
  }
}));

const MenuItemCheckmark = styled(CheckCircle)(({ theme }) => ({
  fontSize: 18,
  marginLeft: 'auto',
  color: '#101840',
}));

const FilterOptionIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 12,
  background: `linear-gradient(145deg, ${alpha('#101840', 0.08)} 0%, ${alpha('#101840', 0.12)} 100%)`,
  boxShadow: `inset 0 0 0 1px ${alpha('#101840', 0.12)}`,
  color: '#101840',
  marginRight: theme.spacing(2),
}));

const ClientsList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  
  // New state for search and filter
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: clients = [], error, isLoading } = useGetClientsQuery();
  const [addClient] = useAddClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  // Filter and search clients
  const filteredClients = React.useMemo(() => {
    let filtered = clients.filter(client => {
      // Apply search filter
      return (
        searchQuery === '' ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    // Sort according to filter
    if (activeFilter === 'highPoints') {
      // Sort all clients by points descending
      filtered = [...filtered].sort((a, b) => b.points - a.points);
    } else if (activeFilter === 'loyal') {
      // Sort all clients by totalVisits descending
      filtered = [...filtered].sort((a, b) => b.totalVisits - a.totalVisits);
    } else if (activeFilter === 'new') {
      // Sort all clients by dateCreated descending (most recent first)
      filtered = [...filtered].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    } else {
      // Default: sort all clients by points descending
      filtered = [...filtered].sort((a, b) => b.points - a.points);
    }

    return filtered;
  }, [clients, searchQuery, activeFilter]);

  const handleAddClient = () => {
    setEditingClient(null);
    setFormOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleDeleteClient = (clientId) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      await deleteClient(clientToDelete);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Do not generate avatar here, let API handle it
      const processedData = {
        ...formData,
        points: Math.max(0, parseInt(formData.points) || 0),
        totalVisits: Math.max(0, parseInt(formData.totalVisits) || 0),
        dateCreated: formData.dateCreated || (editingClient ? editingClient.dateCreated : new Date().toISOString()),
      };

      if (editingClient) {
        // Only send processedData + id for update
        await updateClient({ ...processedData, id: editingClient.id });
      } else {
        await addClient(processedData);
      }
      setFormOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client: ' + error.message);
    }
  };

  const totalPoints = clients.reduce((sum, client) => sum + client.points, 0);
  const totalVisits = clients.reduce((sum, client) => sum + client.totalVisits, 0);
  const averagePoints = clients.length > 0 ? Math.round(totalPoints / clients.length) : 0;

  if (error) {
    return (
      <ErrorState>
        <Alert 
          severity="error"
          sx={{
            maxWidth: 600,
            width: '100%',
            borderRadius: 2,
          }}
        >
          Error loading clients: {error.message}
        </Alert>
      </ErrorState>
    );
  }

  const gradientTextStyle = {
    background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  // Use solid color for icons for compatibility
  const gradientIconColor = { color: '#101840' };

  // Restore these handlers:
  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (filter = null) => {
    if (filter !== null) {
      setActiveFilter(filter);
    }
    setFilterAnchorEl(null);
  };

  return (
    <PremiumContainer>
      <PageContent>
        <Container maxWidth="xl" disableGutters sx={{ mt: 0, pt: 0 }}>
          <PageHeader>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={{ xs: 3, md: 0 }}
            >
              <Box>
                <ModernTitle variant="h2">
                  <TitleAccent sx={gradientTextStyle}>Client</TitleAccent>
                  <span style={gradientTextStyle}> Management</span>
                </ModernTitle>
                <Typography variant="subtitle1" color="textSecondary" sx={{ maxWidth: 600 }}>
                  Manage your loyalty program members and track their engagement metrics
                </Typography>
              </Box>

              <PremiumButton
                variant="contained"
                color="primary"
                startIcon={<PersonAdd sx={{ color: '#fff' }} />}
                onClick={handleAddClient}
              >
                Add New Client
              </PremiumButton>
            </Box>
          </PageHeader>

          <StatsContainer>
            <Box className="MuiGrid-container">
              <Grow in timeout={400}>
                <StatCard elevation={0}>
                  <StatCardHeader>
                    <StatLabel>Total Clients</StatLabel>
                    <StatCardIcon>
                      <PersonAdd sx={{ fontSize: 22, ...gradientIconColor }} />
                    </StatCardIcon>
                  </StatCardHeader>
                  <StatValue sx={gradientTextStyle}>
                    {clients.length}
                  </StatValue>
                  {clients.length > 0 && (
                    <Typography variant="caption" color="textSecondary">
                      Active loyalty program members
                    </Typography>
                  )}
                </StatCard>
              </Grow>

              <Grow in timeout={600}>
                <StatCard elevation={0}>
                  <StatCardHeader>
                    <StatLabel>Accumulated Points</StatLabel>
                    <StatCardIcon>
                      <TrendingUp sx={{ fontSize: 22, ...gradientIconColor }} />
                    </StatCardIcon>
                  </StatCardHeader>
                  <StatValue sx={gradientTextStyle}>
                    {totalPoints.toLocaleString()}
                  </StatValue>
                  {clients.length > 0 && (
                    <Typography variant="caption" color="textSecondary">
                      Avg. {averagePoints} points per client
                    </Typography>
                  )}
                </StatCard>
              </Grow>

              <Grow in timeout={800}>
                <StatCard elevation={0}>
                  <StatCardHeader>
                    <StatLabel>Total Visits</StatLabel>
                    <StatCardIcon>
                      <PieChart sx={{ fontSize: 22, ...gradientIconColor }} />
                    </StatCardIcon>
                  </StatCardHeader>
                  <StatValue sx={gradientTextStyle}>
                    {totalVisits.toLocaleString()}
                  </StatValue>
                  {clients.length > 0 && (
                    <Typography variant="caption" color="textSecondary">
                      Store visits across all clients
                    </Typography>
                  )}
                </StatCard>
              </Grow>
            </Box>
          </StatsContainer>

          <TableWrapper>
            <TableSection>
              <TableHeader>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {activeFilter === 'all' ? 'Clients' : 
                   activeFilter === 'highPoints' ? 'High Points Clients' :
                   activeFilter === 'loyal' ? 'Loyal Clients' : 'New Clients'} ({filteredClients.length})
                </Typography>
                
                {searchOpen ? (
                  <Box sx={{ 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center', 
                    overflow: 'hidden',
                    width: { xs: '100%', sm: 300 }
                  }}>
                    <SearchTextField
                      autoFocus
                      placeholder="Search clients..."
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" sx={{ color: alpha('#101840', 0.7) }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery ? (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setSearchQuery('')}
                              size="small"
                              sx={{ mr: 0.5 }}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null
                      }}
                    />
                    <IconButton
                      onClick={toggleSearch}
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: alpha('#101840', 0.08),
                        width: 28,
                        height: 28,
                        borderRadius: 1.5,
                        ml: 1,
                        '&:hover': {
                          bgcolor: alpha('#101840', 0.15),
                        },
                        display: searchQuery ? 'none' : 'flex',
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box display="flex" gap={1}>
                    <ActionButton 
                      onClick={handleFilterClick}
                      sx={{
                        ...(activeFilter !== 'all' && {
                          backgroundColor: alpha('#101840', 0.12),
                          color: '#101840',
                        })
                      }}
                    >
                      <FilterList fontSize="small" sx={{ color: '#101840' }} />
                    </ActionButton>
                    <ActionButton onClick={toggleSearch}>
                      <Search fontSize="small" sx={{ color: '#101840' }} />
                    </ActionButton>
                    
                    <FilterMenu
                      anchorEl={filterAnchorEl}
                      open={Boolean(filterAnchorEl)}
                      onClose={() => handleFilterClose()}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      transitionDuration={200}
                    >
                      <Box sx={{ 
                        p: 3, 
                        pb: 2, 
                        backgroundImage: 'linear-gradient(to right, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                        backgroundSize: 'cover',
                        borderBottom: `1px solid ${alpha('#f1f5f9', 0.8)}`
                      }}>
                        <Typography 
                          variant="subtitle2"
                          sx={{ 
                            fontWeight: 300, 
                            color: '#1A1A2E',
                            letterSpacing: '-0.01em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: '0.95rem'
                          }}
                        >
                          <FilterList sx={{ fontSize: 20, color: '#101840' }} />
                          <span>Filter <strong>Clients</strong></span>
                        </Typography>
                      </Box>
                      
                      <MenuItem 
                        onClick={() => handleFilterClose('all')}
                        selected={activeFilter === 'all'}
                        sx={{ mt: 0.5 }}
                      >
                        <FilterOptionIcon>
                          <PersonAdd sx={{ fontSize: 18 }} />
                        </FilterOptionIcon>
                        <Typography sx={{ fontWeight: 500 }}>All Clients</Typography>
                        {activeFilter === 'all' && <MenuItemCheckmark />}
                      </MenuItem>
                      
                      <MenuItem 
                        onClick={() => handleFilterClose('highPoints')}
                        selected={activeFilter === 'highPoints'}
                      >
                        <FilterOptionIcon>
                          <TrendingUp sx={{ fontSize: 18 }} />
                        </FilterOptionIcon>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>High Points</Typography>
                        </Box>
                        {activeFilter === 'highPoints' && <MenuItemCheckmark />}
                      </MenuItem>
                      
                      <MenuItem 
                        onClick={() => handleFilterClose('loyal')}
                        selected={activeFilter === 'loyal'}
                      >
                        <FilterOptionIcon>
                          <Star sx={{ fontSize: 18 }} />
                        </FilterOptionIcon>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>Loyal Clients</Typography>
                        </Box>
                        {activeFilter === 'loyal' && <MenuItemCheckmark />}
                      </MenuItem>
                      
                      <MenuItem 
                        onClick={() => handleFilterClose('new')}
                        selected={activeFilter === 'new'}
                        sx={{ mb: 0.5 }}
                      >
                        <FilterOptionIcon>
                          <CalendarToday sx={{ fontSize: 18 }} />
                        </FilterOptionIcon>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>New Clients</Typography>
                        </Box>
                        {activeFilter === 'new' && <MenuItemCheckmark />}
                      </MenuItem>
                    </FilterMenu>
                  </Box>
                )}
              </TableHeader>
              
              <TableContainer elevation={0}>
                <ClientTable 
                  clients={filteredClients} 
                  onEditClient={handleEditClient}
                  onDeleteClient={handleDeleteClient} 
                />
              </TableContainer>
            </TableSection>
          </TableWrapper>

          {/* Add/Edit Client Form Dialog */}
          <ClientForm
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
            client={editingClient}
          />

          {/* Delete Confirmation Dialog */}
          <PremiumDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            TransitionComponent={SlideTransition}
            maxWidth="sm"
            PaperProps={{
              sx: {
                maxWidth: 420,
                borderRadius: 24,
                overflow: 'hidden',
              }
            }}
          >
            <Box sx={{ 
              p: 4, 
              pb: 3,
              textAlign: 'center',
              position: 'relative'
            }}>
              {/* Warning Icon */}
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${alpha('#ef4444', 0.08)} 0%, ${alpha('#dc2626', 0.03)} 100%)`,
                border: `1px solid ${alpha('#ef4444', 0.12)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -1,
                  borderRadius: 'inherit',
                  background: `linear-gradient(135deg, ${alpha('#ef4444', 0.2)}, transparent)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 25px ${alpha('#ef4444', 0.12)}`,
                  '&::before': {
                    opacity: 1,
                  },
                }
              }}>
                <Box sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha('#ef4444', 0.25)}`,
                }}>
                  ✕
                </Box>
              </Box>

              {/* Title */}
              <Typography variant="h6" sx={{ 
                fontWeight: 500,
                color: '#1A1A2E',
                letterSpacing: '-0.025em',
                mb: 1.5,
                fontSize: '1.25rem'
              }}>
                Delete Client
              </Typography>

              {/* Message */}
              <Typography sx={{ 
                color: alpha('#1A1A2E', 0.7), 
                fontWeight: 400,
                lineHeight: 1.6,
                mb: 4,
                fontSize: '0.95rem'
              }}>
                Are you sure you want to delete this client? This action cannot be undone.
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                justifyContent: 'center'
              }}>
                <PremiumButton
                  onClick={() => setDeleteDialogOpen(false)}
                  sx={{ 
                    background: 'transparent',
                    color: alpha('#1A1A2E', 0.7),
                    minWidth: 100,
                    boxShadow: 'none',
                    border: `1.5px solid ${alpha('#e0e7ff', 0.5)}`,
                    '&:hover': {
                      background: alpha('#64748b', 0.08),
                      color: '#1A1A2E',
                      boxShadow: 'none',
                    },
                    '&::before': {
                      background: 'none',
                    }
                  }}
                >
                  Cancel
                </PremiumButton>
                <PremiumButton
                  onClick={confirmDelete}
                  sx={{
                    background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`,
                    minWidth: 100,
                    '&:hover': {
                      background: `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)`,
                      boxShadow: `0 8px 25px ${alpha('#ef4444', 0.35)}`,
                    },
                    '&::before': {
                      background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.25)}, transparent)`,
                    }
                  }}
                >
                  Delete
                </PremiumButton>
              </Box>
            </Box>
          </PremiumDialog>
        </Container>
      </PageContent>

      
    </PremiumContainer>
  );
};

export default ClientsList;