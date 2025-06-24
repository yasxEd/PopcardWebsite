import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  useTheme,
  Container,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Dashboard,
  People,
  Settings,
  ExitToApp,
  AccountCircle,
  Menu as MenuIcon,
  Home,
  Analytics,
  LocalOffer,
  TrendingUp,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

// Animations
const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
`;

// Styled Components
const FloatingAppBar = styled(AppBar)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(248, 250, 252, 0.9) 100%
    )
  `,
  backdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  borderRadius: '24px',
  boxShadow: `
    0 20px 40px rgba(16, 24, 64, 0.12),
    0 8px 24px rgba(16, 24, 64, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9)
  `,
  animation: `${slideDown} 0.8s cubic-bezier(0.16, 1, 0.3, 1), ${floatAnimation} 6s ease-in-out infinite`,
  position: 'fixed',
  top: '20px',
  left: 0,
  right: 0,
  transform: 'none',
  width: '100%',
  maxWidth: '1365px', // was 1300px, increased by 5%
  zIndex: 1200,
  margin: '0 auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '24px',
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(226, 232, 240, 0.4) 100%)',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const LogoImage = styled('img')({
  width: 80, // was 200
  height: 40, // was 100
  objectFit: 'contain',
  filter: 'drop-shadow(0 4px 12px rgba(16, 24, 64, 0.15))',
});

const NavButton = styled(Button)(({ theme, active }) => ({
  borderRadius: '16px',
  padding: '10px 20px',
  margin: '0 6px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: active ? '#101840' : '#64748b',
  background: active ? 
    'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.7) 100%)' : 
    'transparent',
  border: active ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
  boxShadow: active ? 
    '0 8px 20px rgba(16, 24, 64, 0.1), 0 4px 12px rgba(16, 24, 64, 0.06)' : 
    'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    background: active ?
      'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)' :
      'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(241, 245, 249, 0.5) 100%)',
    borderColor: 'rgba(16, 24, 64, 0.2)',
    color: '#101840',
    transform: 'translateY(-2px)',
    boxShadow: `
      0 12px 28px rgba(16, 24, 64, 0.15),
      0 6px 16px rgba(16, 24, 64, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9)
    `,
    '&::before': {
      left: '100%',
    },
  },
}));

const ProfileButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  background: `
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.9) 0%, 
      rgba(241, 245, 249, 0.7) 100%
    )
  `,
  backdropFilter: 'blur(30px) saturate(180%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  borderRadius: '16px',
  boxShadow: `
    0 12px 28px rgba(16, 24, 64, 0.1),
    0 6px 16px rgba(16, 24, 64, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9)
  `,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.95) 0%, 
        rgba(248, 250, 252, 0.9) 100%
      )
    `,
    borderColor: 'rgba(16, 24, 64, 0.3)',
    transform: 'translateY(-3px) scale(1.05)',
    boxShadow: `
      0 20px 40px rgba(16, 24, 64, 0.15),
      0 10px 20px rgba(16, 24, 64, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.95)
    `,
    '&::before': {
      left: '100%',
    },
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Mock user data - in real app this would come from Redux store
  const user = useSelector((state) => state.auth.user) || {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: null
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <FloatingAppBar position="fixed" elevation={0}>
        <Toolbar
          sx={{
            px: 4,
            py: 1,
            minHeight: '72px !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 1200,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 72,
              position: 'relative',
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'absolute',
                left: '-32px', // move more to the left
                top: 0,
                bottom: 0,
                height: '100%',
                pl: 0,
              }}
            >
              <Logo onClick={handleLogoClick}>
                <LogoImage src="/logo.png" alt="Logo" />
              </Logo>
            </Box>
            {/* Centered Mini Loyalty System text */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#1A1A2E',
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                ᯓ Mini Loyalty System ᯓ
              </Typography>
            </Box>
            {/* Profile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'absolute',
                right: '-32px', // move more to the right
                top: 0,
                bottom: 0,
                height: '100%',
                pr: 0,
              }}
            >
              <Tooltip title="Account" placement="bottom" arrow>
                <ProfileButton onClick={handleProfileMenuOpen}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                </ProfileButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </FloatingAppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '20px',
            minWidth: 280,
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(248, 250, 252, 0.9) 100%
              )
            `,
            backdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: `
              0 20px 50px rgba(16, 24, 64, 0.15),
              0 10px 30px rgba(16, 24, 64, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -8,
              right: 14,
              width: 16,
              height: 16,
              background: 'inherit',
              border: 'inherit',
              transform: 'rotate(45deg)',
              borderBottom: 'none',
              borderRight: 'none',
            },
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 52,
                height: 52,
                background: 'linear-gradient(135deg, #101840 0%, #1e293b 100%)',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#101840',
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(226, 232, 240, 0.8)' }} />

        {/* Menu Items */}
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            py: 1.5,
            px: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
            },
          }}
        >
          <ListItemIcon>
            <AccountCircle sx={{ color: '#64748b', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            sx={{
              '& .MuiListItemText-primary': {
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: 500,
                color: '#475569',
              },
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={handleMenuClose}
          sx={{
            py: 1.5,
            px: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
            },
          }}
        >
          <ListItemIcon>
            <Settings sx={{ color: '#64748b', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            sx={{
              '& .MuiListItemText-primary': {
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: 500,
                color: '#475569',
              },
            }}
          />
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(226, 232, 240, 0.8)' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
            },
          }}
        >
          <ListItemIcon>
            <ExitToApp sx={{ color: '#64748b', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            sx={{
              '& .MuiListItemText-primary': {
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: 500,
                color: '#475569',
              },
            }}
          />
        </MenuItem>
      </Menu>

      {/* Spacer for floating navbar */}
      <Box sx={{ height: '110px' }} />
    </>
  );
};

export default Navbar;