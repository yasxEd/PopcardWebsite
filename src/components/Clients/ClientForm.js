import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Fade,
  InputAdornment,
  Zoom,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import { 
  Close, 
  Person, 
  Email, 
  Phone, 
  Save, 
  Add, 
  CheckCircle, 
  TrendingUp, 
  CalendarToday 
} from '@mui/icons-material';

// Animations
const slideInFromTop = keyframes`
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 24, 64, 0.2); }
  50% { box-shadow: 0 0 0 6px rgba(16, 24, 64, 0.05); }
`;

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    padding: 0,
    minWidth: 1200,
    maxWidth: 1300,
    background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
    boxShadow: '0px 20px 60px rgba(99, 102, 241, 0.15), 0px 8px 25px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha('#e0e7ff', 0.3)}`,
  },
});

const DialogHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${alpha('#e0e7ff', 0.4)}`,
  background: 'linear-gradient(135deg, rgba(16, 24, 64, 0.02) 0%, rgba(16, 24, 64, 0.05) 100%)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(16, 24, 64, 0.1), transparent)',
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  position: 'relative',
}));

const TableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '2fr 1.8fr 2.5fr 0fr 0.9fr', // Name, Email, Phone get more space, Points/Visits smaller
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  background: 'linear-gradient(135deg, rgba(16, 24, 64, 0.03) 0%, rgba(16, 24, 64, 0.06) 100%)',
  borderRadius: 16,
  border: `1px solid ${alpha('#e0e7ff', 0.5)}`,
  marginBottom: theme.spacing(2),
  animation: `${slideInFromTop} 0.6s ease-out`,
}));

const HeaderCell = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.8rem',
  color: '#101840',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  justifyContent: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    opacity: 0.7,
  }
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.3fr 1.7fr 1.7fr 1.2fr', // Name, Email, Phone get more space, Points/Visits smaller
  gap: theme.spacing(2), // Consistent gap
  alignItems: 'start',
  padding: theme.spacing(2, 3),
  background: 'linear-gradient(135deg, #ffffff 0%, rgba(250, 251, 255, 0.8) 100%)',
  borderRadius: 20,
  border: `1.5px solid ${alpha('#e0e7ff', 0.6)}`,
  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${slideInFromTop} 0.8s ease-out 0.2s both`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -200,
    width: 200,
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    animation: `${shimmer} 2s infinite`,
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.15)',
    borderColor: alpha('#101840', 0.2),
  }
}));

const FormField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  position: 'relative',
  width: '100%', // Ensure full width
}));

const StyledTextField = styled(TextField)(({ theme, compact }) => ({
  width: '100%', // Full width for all fields
  '& .MuiOutlinedInput-root': {
    borderRadius: compact ? 12 : 16,
    backgroundColor: '#ffffff',
    border: `1.5px solid ${alpha('#e0e7ff', 0.6)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: compact ? 48 : 56,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      borderColor: alpha('#101840', 0.3),
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
      transform: 'translateY(-1px)',
      backgroundColor: '#fafbff',
    },
    '&.Mui-focused': {
      borderColor: '#101840',
      boxShadow: '0 8px 25px rgba(16, 24, 64, 0.2)',
      transform: 'translateY(-2px)',
      backgroundColor: '#fafbff',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 'inherit',
        background: 'linear-gradient(45deg, #101840, #1e293b)',
        zIndex: -1,
        opacity: 0.1,
      }
    },
    '&.Mui-error': {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2',
      animation: `${pulse} 1s ease-out`,
    },
    '& fieldset': { border: 'none' },
  },
  '& .MuiInputLabel-root': { display: 'none' },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(compact ? 1.5 : 1.75, 2),
    fontSize: compact ? '0.85rem' : '0.9rem',
    fontWeight: 500,
    color: '#1A1A2E',
    textAlign: 'left', // Consistent left alignment
    '&::placeholder': {
      color: alpha('#1A1A2E', 0.4),
      opacity: 1,
      fontSize: '0.85rem',
    }
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 8,
    fontSize: '0.7rem',
    fontWeight: 500,
    marginTop: 6,
    color: '#ef4444',
    opacity: 0,
    transform: 'translateY(-8px)',
    transition: 'all 0.3s ease',
    '&.Mui-error': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  },
}));

const ContactFieldGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row', // Side by side instead of stacked
  gap: theme.spacing(1),
  width: '100%',
}));

const ActionRow = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderTop: `1px solid ${alpha('#e0e7ff', 0.4)}`,
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  background: 'linear-gradient(135deg, rgba(16, 24, 64, 0.01) 0%, rgba(16, 24, 64, 0.03) 100%)',
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.75, 4),
  background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  boxShadow: '0 6px 20px rgba(16, 24, 64, 0.3)',
  minHeight: 52,
  minWidth: 140,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #0f1629 0%, #1a2332 100%)',
    boxShadow: '0 8px 30px rgba(16, 24, 64, 0.4)',
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    }
  },
  '&:active': { transform: 'translateY(0)' },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.75, 3),
  color: alpha('#1A1A2E', 0.7),
  backgroundColor: 'transparent',
  border: `1.5px solid ${alpha('#e0e7ff', 0.6)}`,
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '0.9rem',
  minHeight: 52,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha('#101840', 0.05),
    borderColor: alpha('#101840', 0.2),
    transform: 'translateY(-1px)',
    color: '#101840',
    boxShadow: '0 4px 15px rgba(16, 24, 64, 0.1)',
  },
}));

const ClientForm = ({ open, onClose, onSubmit, client = null }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    points: '0',
    totalVisits: '0',
    dateCreated: '', // <-- add this line
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        points: client.points?.toString() || '0',
        totalVisits: client.totalVisits?.toString() || '0',
        dateCreated: client.dateCreated || '', // <-- add this line
      });
    } else {
      setFormData({ 
        name: '', 
        email: '', 
        phone: '',
        points: '0',
        totalVisits: '0',
        dateCreated: '', // <-- add this line
      });
    }
    setErrors({});
    setIsSubmitting(false);
  }, [client, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name too short';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone required';
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const submitData = client
        ? { 
            ...client,
            ...formData,
            points: parseInt(formData.points) || 0,
            totalVisits: parseInt(formData.totalVisits) || 0,
            dateCreated: formData.dateCreated || client.dateCreated, // always include dateCreated
          }
        : {
            ...formData,
            points: parseInt(formData.points) || 0,
            totalVisits: parseInt(formData.totalVisits) || 0,
          };
      
      onSubmit(submitData);
      setIsSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={500}
    >
      <DialogHeader>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: '#101840',
              fontSize: '1.5rem',
              letterSpacing: '-0.02em'
            }}
          >
            {client ? 'Edit Client' : 'New Client'}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: alpha('#1A1A2E', 0.6),
              backgroundColor: alpha('#e0e7ff', 0.3),
              width: 44,
              height: 44,
              borderRadius: 3,
              border: `1px solid ${alpha('#e0e7ff', 0.5)}`,
              '&:hover': {
                backgroundColor: alpha('#e0e7ff', 0.6),
                color: '#1A1A2E',
                transform: 'rotate(90deg) scale(1.1)',
                borderColor: alpha('#101840', 0.2),
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 0 }}>
          <FormContainer>
            <TableHeader>
              <HeaderCell>
                <Person fontSize="small" />
                Name
              </HeaderCell>
              <HeaderCell>
                <Email fontSize="small" />
                Email
              </HeaderCell>
              <HeaderCell>
                <Phone fontSize="small" />
                Phone
              </HeaderCell>
              <HeaderCell>
                <TrendingUp fontSize="small" />
                Points
              </HeaderCell>
              <HeaderCell>
                <TrendingUp fontSize="small" />
                Visits
              </HeaderCell>
            </TableHeader>
            
            <FormRow>
              <FormField>
                <StyledTextField
                  fullWidth
                  type="text"
                  placeholder="Client name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#64748b', fontSize: '0.9rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: formData.name && !errors.name && (
                      <InputAdornment position="end">
                        <Zoom in={true}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: '1rem' }} />
                        </Zoom>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>
              
              <FormField>
                <StyledTextField
                  fullWidth
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#64748b', fontSize: '0.9rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: formData.email && !errors.email && (
                      <InputAdornment position="end">
                        <CheckCircle sx={{ color: '#10b981', fontSize: '0.9rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>
              
              <FormField>
                <StyledTextField
                  fullWidth
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#64748b', fontSize: '0.9rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: formData.phone && !errors.phone && (
                      <InputAdornment position="end">
                        <CheckCircle sx={{ color: '#10b981', fontSize: '0.9rem' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>
              
              <FormField>
                <ContactFieldGroup>
                  <StyledTextField
                    fullWidth
                    type="number"
                    placeholder="Pts"
                    value={formData.points}
                    onChange={handleChange('points')}
                    compact
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TrendingUp sx={{ color: '#64748b', fontSize: '0.8rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-input': {
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        padding: '18.5px 8px', // Match default MUI TextField height
                      },
                      '& .MuiOutlinedInput-root': {
                        minHeight: 56, // Match other fields
                      }
                    }}
                  />
                  <StyledTextField
                    fullWidth
                    type="number"
                    placeholder="Visits"
                    value={formData.totalVisits}
                    onChange={handleChange('totalVisits')}
                    compact
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#64748b', fontSize: '0.8rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-input': {
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        padding: '18.5px 8px', // Match default MUI TextField height
                      },
                      '& .MuiOutlinedInput-root': {
                        minHeight: 56, // Match other fields
                      }
                    }}
                  />
                </ContactFieldGroup>
              </FormField>
            </FormRow>
          </FormContainer>
        </DialogContent>

        <ActionRow>
          <SecondaryButton 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? null : (client ? <Save fontSize="small" /> : <Add fontSize="small" />)
            }
          >
            {isSubmitting ? 'Saving...' : (client ? 'Update' : 'Add Client')}
          </PrimaryButton>
        </ActionRow>
      </form>
    </StyledDialog>
  );
};

export default ClientForm;