import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import customTheme from '../theme';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cart = useSelector(state => state.coupons.currentCart);
  const cartItemCount = cart?.items?.length || 0;

  const navItems = [
    { text: 'Products', path: '/' },
    { text: 'Coupons', path: '/coupons' },
    { text: 'Create Coupon', path: '/create' },
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'yellow',
        boxShadow: 'none',
        borderBottom: `1px solid ${customTheme.colors.divider}`
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        {isMobile && (
          <IconButton
            edge="start"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{ 
              color: customTheme.colors.background.default,
              '&:hover': {
                backgroundColor: customTheme.colors.secondary.light
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )} 

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: customTheme.colors.background.default,
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '1.25rem',
          }}
        >
          Monk Commerce
        </Typography>

        <Box sx={{ display: { xs: mobileMenuOpen ? 'flex' : 'none', sm: 'flex' } }}>
          {navItems.map((item) => (
            <Button
              key={item.text}
              component={RouterLink}
              to={item.path}
              sx={{ 
                mx: 1,
                color: customTheme.colors.background.default,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: customTheme.colors.secondary.light
                }
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        <IconButton
          component={RouterLink}
          to="/cart"
          sx={{ 
            ml: 2,
            color: customTheme.colors.background.default,
            '&:hover': {
              backgroundColor: customTheme.colors.secondary.light
            }
          }}
        >
          <Badge 
            badgeContent={cartItemCount} 
            sx={{ 
              '& .MuiBadge-badge': {
                backgroundColor: customTheme.colors.primary.main,
                color: customTheme.colors.background.default
              }
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
