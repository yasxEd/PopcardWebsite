import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Container,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Collapse,
  CircularProgress,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Close,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import Footer from '../Layout/Footer';

// Enhanced Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Enhanced container with gradient background
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff', // changed to solid white
  position: 'relative',
  padding: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'none', // remove gradient overlay
    pointerEvents: 'none',
  },
}));

// Enhanced welcome screen with floating elements
const WelcomeScreen = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#fff', // changed to solid white
  position: 'relative',
  animation: `${fadeIn} 1s ease forwards`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'none', // remove gradient overlay
    pointerEvents: 'none',
  },
}));

// Enhanced welcome card with hover effects
const WelcomeCard = styled(Card)(({ theme, isHovered }) => ({
  borderRadius: 24,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(8, 6),
  maxWidth: 520,
  width: '100%',
  textAlign: 'center',
  position: 'relative',
  animation: `${slideUp} 0.8s ease forwards, ${float} 6s ease-in-out infinite`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.08)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
    animation: `${shimmer} 1.5s ease-in-out`,
  },
}));

// Enhanced login card with glass morphism
const LoginCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
  width: '100%',
  maxWidth: 480,
  position: 'relative',
  animation: `${scaleIn} 0.5s ease forwards`,
  overflow: 'hidden',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  color: '#9ca3af',
  zIndex: 10,
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#6b7280',
    background: alpha('#f3f4f6', 0.8),
    transform: 'rotate(90deg)',
  },
}));

// Enhanced logo with gradient and animation
const PopcardLogo = styled(Typography)(({ theme }) => ({
  fontSize: '2.25rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(4),
  fontFamily: '"Poppins", "Inter", "Roboto", sans-serif', // changed to Poppins
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  animation: `${slideDown} 0.6s ease forwards`,
  '&::before': {
    content: '"●"',
    background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '1.5rem',
    animation: `${pulse} 2s ease-in-out infinite`,
  },
}));

const WelcomeTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #101840 0%, #374151 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  animation: `${fadeIn} 0.8s ease 0.2s both`,
}));

const WelcomeSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  color: '#6b7280',
  marginBottom: theme.spacing(5),
  textAlign: 'center',
  fontWeight: 400,
  animation: `${fadeIn} 0.8s ease 0.4s both`,
}));

const LoginTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  animation: `${fadeIn} 0.6s ease 0.1s both`,
}));

// Enhanced continue button with gradient and hover effects
const ContinueButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: '#7a7f8a', // even more greyish text color
  border: 'none',
  borderRadius: 10,
  padding: theme.spacing(1, 3),
  fontSize: '0.85rem',
  fontWeight: 600,
  textTransform: 'none',
  minHeight: 32,
  minWidth: 0,
  width: 300,
  height: 45,
  alignSelf: 'center',
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'monospace, "Fira Mono", "Menlo", "Consolas", "Liberation Mono", "Courier New", monospace',
  boxShadow: '0 2px 8px 0 rgba(30,41,59,0.13), 0 1.5px 0 #fff inset',
  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeIn} 0.8s ease 0.6s both`,
  '&:hover': {
    background: 'transparent',
    color: '#23272f',
    boxShadow: '0 4px 16px 0 rgba(30,41,59,0.18), 0 2px 0 #fff inset',
    transform: 'translateY(-2px) scale(1.03)',
  },
  '&:active': {
    boxShadow: '0 1.5px 4px 0 rgba(30,41,59,0.10), 0 1px 0 #fff inset',
    transform: 'translateY(1px) scale(0.98)',
  },
}));

// Enhanced demo credentials button to match ContinueButton style but smaller

// Enhanced form fields with focus animations
const FormTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e5e7eb',
      borderWidth: 2,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#101840',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(16,24,64,0.15)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#101840',
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontSize: '1rem',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#101840',
    },
  },
}));

// Enhanced sign in button with loading state
const SignInButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  fontSize: '1rem',
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
  color: '#fff',
  border: 'none',
  height: 60, // increased height
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

const DemoCredentialsButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: '#7a7f8a',
  border: 'none',
  borderRadius: 14,
  padding: theme.spacing(1, 3),
  fontSize: '0.78rem', // smaller font
  fontWeight: 600,
  textTransform: 'none',
  minHeight: 28,
  minWidth: 0,
  width: 400, // increased width
  height: 60, // increased height
  alignSelf: 'center',
  display: 'block', // ensure block for margin auto
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'monospace, "Fira Mono", "Menlo", "Consolas", "Liberation Mono", "Courier New", monospace',
  boxShadow: '0 2px 8px 0 rgba(30,41,59,0.13), 0 1.5px 0 #fff inset',
  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeIn} 0.8s ease 0.7s both`,
  marginTop: theme.spacing(2),
  '&:hover': {
    background: 'transparent',
    color: '#23272f',
    boxShadow: '0 4px 16px 0 rgba(30,41,59,0.18), 0 2px 0 #fff inset',
    transform: 'translateY(-2px) scale(1.03)',
  },
  '&:active': {
    boxShadow: '0 1.5px 4px 0 rgba(30,41,59,0.10), 0 1px 0 #fff inset',
    transform: 'translateY(1px) scale(0.98)',
  },
}));

const FormContainer = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(5, 5, 4),
  position: 'relative',
}));

// Enhanced success state
const SuccessOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  borderRadius: 24,
  animation: `${fadeIn} 0.5s ease forwards`,
}));

const LoginForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContinue = () => {
    setShowLogin(true);
  };

  const handleClose = () => {
    setShowLogin(false);
    setError('');
    setEmail('');
    setPassword('');
    setFieldErrors({});
    setSuccess(false);
  };

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Please enter a valid email';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate all fields
    validateField('email', email);
    validateField('password', password);

    if (Object.keys(fieldErrors).length > 0) {
      setLoading(false);
      return;
    }

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock login validation
    if (email === 'admin@popcard.com' && password === 'popcard2025') {
      setSuccess(true);
      // Simulate redirect delay
      setTimeout(() => {
        dispatch(login({ name: 'Admin User', email })); // dispatch login
        navigate('/clients'); // redirect to clients page
      }, 1200);
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }

    setLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@popcard.com');
    setPassword('popcard2025');
    setError('');
    setFieldErrors({});
  };

  if (!showLogin) {
    return (
      <>
        <WelcomeScreen>
          <WelcomeCard>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 0 }}>
              <img
                src="/Logo.png"
                alt="Logo"
                style={{ height: 30, width: 'auto', display: 'block' }}
              />
              <WelcomeTitle sx={{ mt: 4, mb: 0 }}>
                ᯓ Mini Loyalty System ᯓ
              </WelcomeTitle>
            </Box>
            <WelcomeSubtitle sx={{ mb: 4 }}></WelcomeSubtitle>
            <Box sx={{ mt: 4 }}>
              <ContinueButton
                onClick={handleContinue}
              >
                Click Anywhere To Continue
              </ContinueButton>
            </Box>
          </WelcomeCard>
        </WelcomeScreen>
        <Footer />
      </>
    );
  }

  return (
    <>
      <LoginContainer>
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <LoginCard>
            <CloseButton onClick={handleClose}>
              <Close />
            </CloseButton>
            <FormContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <img
                  src="/Logo.png"
                  alt="Logo"
                  style={{ height: 30, width: 'auto', display: 'block' }}
                />
              </Box>
              <LoginTitle>Welcome back</LoginTitle>

              <Collapse in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    border: 'none',
                    background: alpha('#fee2e2', 0.9),
                    color: '#dc2626',
                    animation: `${slideUp} 0.3s ease forwards`,
                  }}
                >
                  {error}
                </Alert>
              </Collapse>

              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      color: '#374151', 
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textAlign: 'left', // ensure label is left-aligned
                      display: 'block', // force block to avoid centering
                      width: '100%',   // take full width of parent
                    }}
                  >
                    Email address
                  </Typography>
                  <FormTextField
                    fullWidth
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField('email', e.target.value);
                    }}
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#101840', fontSize: '1.2rem' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      color: '#374151', 
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}
                  >
                    Password
                  </Typography>
                  <FormTextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validateField('password', e.target.value);
                    }}
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#101840', fontSize: '1.2rem' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ 
                              color: '#9ca3af',
                              '&:hover': { color: '#3b82f6' }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <SignInButton
                  type="submit"
                  fullWidth
                  disabled={loading || success}
                  isLoading={loading}
                  endIcon={loading ? (
                    <CircularProgress size={20} sx={{ color: 'inherit', mb: 1 }} />
                  ) : success ? null : (
                    <ArrowForward />
                  )}
                  sx={{ mb: 2, color: '#fff !important' }} // force white text
                >
                  {loading ? 'Signing in...' : success ? 'Success!' : 'Sign in to dashboard'}
                </SignInButton>

                <DemoCredentialsButton
                  fullWidth
                  onClick={fillDemoCredentials}
                  disabled={loading || success}
                  sx={{ display: 'block', mx: 'auto', mt: 1 }}
                >
                  CLICK ME TO REVEAL DEMO CREDENTIALS
                </DemoCredentialsButton>
              </Box>
            </FormContainer>
          </LoginCard>
        </Container>
      </LoginContainer>
      <Footer />
    </>
  );
};

export default LoginForm;