import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  Tooltip,
  useTheme,
  Badge,
  Collapse,
  Fade,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import { Edit, Delete, Email, Phone, CalendarToday, TrendingUp, PersonAdd, Star, Favorite } from '@mui/icons-material';
import { getDiceBearAvatar } from '../../store/clientsApi';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseScale = keyframes`
  0% {
    transform: scale(0.98);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.01);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Premium styled components with enhanced UI
const PremiumTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0px 8px 32px rgba(99, 102, 241, 0.08), 0px 2px 8px rgba(0, 0, 0, 0.04)',
  border: 'none',
  background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
  backdropFilter: 'blur(10px)',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    background: 'transparent',
    borderBottom: `1px solid ${alpha('#e0e7ff', 0.8)}`,
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: 'none',
    padding: theme.spacing(2.5),
  },
  '& .MuiTableCell-body': {
    borderBottom: `1px solid ${alpha('#e0e7ff', 0.5)}`,
    padding: theme.spacing(2.5),
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
      '& .action-buttons': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    '&:last-child .MuiTableCell-body': {
      borderBottom: 'none',
    },
  },
}));

const PremiumAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  border: `3px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
  },
}));

const PremiumChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 500,
  fontSize: '0.8rem',
  height: 28,
  '&.MuiChip-filled': {
    color: 'white',
  },
  '&.MuiChip-outlined': {
    borderWidth: 1.5,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  transition: 'all 0.2s ease',
  '&.edit-button': {
    color: '#101840',
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(8px)',
    border: `1.5px solid ${alpha('#101840', 0.10)}`,
    boxShadow: '0 2px 8px 0 rgba(16,24,64,0.08)',
    '&:hover': {
      backgroundColor: alpha('#101840', 0.10),
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(16,24,64,0.12)',
    },
  },
  '&.delete-button': {
    color: '#ef4444',
    backgroundColor: alpha('#ef4444', 0.08),
    '&:hover': {
      backgroundColor: alpha('#ef4444', 0.15),
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha('#ef4444', 0.2)}`,
    },
  },
}));

const EmptyState = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: 16,
  background: '#ffffff',
  border: `1px solid ${alpha('#1A1A2E', 0.06)}`,
}));

const EmptyStateIcon = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'rgba(26, 26, 46, 0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    color: '#1A1A2E',
    border: `1.5px solid ${alpha('#1A1A2E', 0.10)}`,
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  '& .contact-item': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: 14,
      color: alpha('#1A1A2E', 0.5),
    },
    '& .MuiTypography-root': {
      fontSize: '0.8rem',
      color: alpha('#1A1A2E', 0.7),
    },
  },
}));

const AnimatedTableRow = styled(TableRow)(({ theme, index, isFiltered }) => ({
  animation: isFiltered 
    ? `${fadeInUp} ${0.2 + index * 0.05}s ease-out forwards`
    : 'none',
  opacity: isFiltered ? 0 : 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    '& .action-buttons': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
  '&:last-child .MuiTableCell-body': {
    borderBottom: 'none',
  },
}));

const AnimatedChip = styled(PremiumChip)(({ theme, isFiltered }) => ({
  animation: isFiltered ? `${pulseScale} 0.6s ease-out forwards` : 'none',
  transition: 'all 0.3s ease',
}));

const AnimatedTableContainer = styled(PremiumTableContainer)(({ theme, isFiltered }) => ({
  position: 'relative',
  '&::before': isFiltered ? {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 1s ease-out`,
    pointerEvents: 'none',
    zIndex: 1
  } : {},
}));

const GlassChip = styled(PremiumChip)(({ theme }) => ({
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(8px)',
  border: `1.5px solid ${alpha('#101840', 0.10)}`,
  color: '#101840',
  fontWeight: 600,
  minWidth: '60px',
  boxShadow: '0 2px 8px 0 rgba(16,24,64,0.08)',
}));

const ClientTable = ({ clients, onEditClient, onDeleteClient }) => {
  const theme = useTheme();
  const [animateRows, setAnimateRows] = useState(false);
  const [prevClientsLength, setPrevClientsLength] = useState(clients.length);
  
  // Trigger animation when clients data changes (search/filter)
  useEffect(() => {
    if (clients.length !== prevClientsLength) {
      setAnimateRows(true);
      setPrevClientsLength(clients.length);
      
      const timer = setTimeout(() => {
        setAnimateRows(false);
      }, 800); // Reset after animations complete
      
      return () => clearTimeout(timer);
    }
  }, [clients, prevClientsLength]);

  const getPointsColor = (points) => {
    // Use gradient for background, white text
    return { 
      color: '#fff', 
      bg: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)' 
    };
  };

  const getVisitsColor = (visits) => {
    if (visits >= 15) return 'success';
    if (visits >= 10) return 'primary';
    if (visits >= 5) return 'warning';
    return 'default';
  };

  if (clients.length === 0) {
    return (
      <Fade in={true} timeout={400}>
        <EmptyState>
          <EmptyStateIcon>
            <PersonAdd sx={{ fontSize: 32 }} />
          </EmptyStateIcon>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#1A1A2E' }}>
            No clients found
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#1A1A2E', 0.6) }}>
            {prevClientsLength > 0 
              ? "No results match your current search or filter"
              : "Start by adding your first client to the loyalty program"}
          </Typography>
        </EmptyState>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={300}>
      <AnimatedTableContainer isFiltered={animateRows}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="center">Points</TableCell>
              <TableCell align="center">Visits</TableCell>
              <TableCell align="center">Member Since</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client, index) => {
              const pointsStyle = getPointsColor(client.points);
              return (
                <AnimatedTableRow 
                  key={client.id} 
                  index={index} 
                  isFiltered={animateRows}
                >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                  <PremiumAvatar 
                    src={client.avatar || getDiceBearAvatar(client)}
                    alt={client.name}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </PremiumAvatar>
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        color: '#1A1A2E',
                        fontSize: '0.95rem',
                      }}
                    >
                      {client.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: alpha('#1A1A2E', 0.5),
                        fontSize: '0.8rem',
                      }}
                    >
                      ID: #{client.id.toString().padStart(4, '0')}
                    </Typography>
                  </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <ContactInfo>
                  <Box className="contact-item">
                    <Email />
                    <Typography>{client.email}</Typography>
                  </Box>
                  <Box className="contact-item">
                    <Phone />
                    <Typography>{client.phone}</Typography>
                  </Box>
                  </ContactInfo>
                </TableCell>
                
                <TableCell align="center">
                  <AnimatedChip
                    label={`${client.points} pts`}
                    isFiltered={animateRows}
                    sx={{
                      background: pointsStyle.bg,
                      color: pointsStyle.color,
                      fontWeight: 600,
                      minWidth: '80px',
                    }}
                    icon={<TrendingUp sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                  />
                </TableCell>
                <TableCell align="center">
                  <GlassChip
                    label={client.totalVisits}
                    color="default"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      minWidth: '60px',
                    }}
                  />
                </TableCell>
                
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <CalendarToday sx={{ fontSize: 14, color: alpha('#1A1A2E', 0.5) }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                    fontSize: '0.8rem',
                    color: alpha('#1A1A2E', 0.7),
                    }}
                  >
                    {new Date(client.dateCreated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                    })}
                  </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Box 
                  className="action-buttons"
                  display="flex" 
                  gap={1} 
                  justifyContent="center"
                  sx={{ 
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease',
                  }}
                  >
                  <Tooltip title="Edit Client" arrow>
                    <ActionButton
                    className="edit-button"
                    size="small"
                    onClick={() => onEditClient(client)}
                    data-testid={`edit-client-${client.id}`}
                    >
                    <Edit sx={{ fontSize: 18 }} />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Delete Client" arrow>
                    <ActionButton
                    className="delete-button"
                    size="small"
                    onClick={() => onDeleteClient(client.id)}
                    data-testid={`delete-client-${client.id}`}
                    >
                    <Delete sx={{ fontSize: 18 }} />
                    </ActionButton>
                  </Tooltip>
                  </Box>
                </TableCell>
                </AnimatedTableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </AnimatedTableContainer>
    </Fade>
  );
};

export default ClientTable;