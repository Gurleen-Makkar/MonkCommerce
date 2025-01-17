import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import customTheme from '../theme';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { fetchCoupons, deleteCoupon } from '../store/couponSlice';

function CouponList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons, status, error } = useSelector((state) => state.coupons);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCoupons());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      dispatch(deleteCoupon(id));
    }
  };

  const formatCouponDetails = (coupon) => {
    switch (coupon.type) {
      case 'cart-wise':
        return `${coupon.details.discount}% off on cart total above ₹${coupon.details.threshold}`;
      case 'product-wise':
        return `${coupon.details.discount}% off on Product #${coupon.details.product_id}`;
      case 'bxgy': {
        const buyProducts = coupon.details.buy_products
          .map(p => `${p.quantity}x Product #${p.product_id}`)
          .join(' or ');
        const getProducts = coupon.details.get_products
          .map(p => `${p.quantity}x Product #${p.product_id}`)
          .join(' or ');
        return `Buy ${buyProducts}, Get ${getProducts} Free (Max ${coupon.details.repetition_limit} times)`;
      }
      default:
        return 'Invalid coupon type';
    }
  };

  const getChipColor = (type) => {
    switch (type) {
      case 'cart-wise':
        return 'primary';
      case 'product-wise':
        return 'secondary';
      case 'bxgy':
        return 'success';
      default:
        return 'default';
    }
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: customTheme.colors.background.default }}>
      <Typography variant="h4" sx={{ 
        mb: 4,
        fontWeight: 600,
        color: customTheme.colors.text.primary 
      }}>
        Available Coupons
      </Typography>

      <Grid container spacing={3}>
        {coupons.map((coupon) => (
          <Grid item xs={12} sm={6} md={4} key={coupon._id}>
            <Card 
              elevation={0}
              sx={{ 
                position: 'relative',
                opacity: isExpired(coupon.expiryDate) ? 0.7 : 1,
                border: `1px solid ${customTheme.colors.divider}`,
                backgroundColor: customTheme.colors.background.paper,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}>
              {isExpired(coupon.expiryDate) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'error.main',
                      border: '2px solid',
                      borderColor: 'error.main',
                      padding: '4px 8px',
                      borderRadius: 1,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    EXPIRED
                  </Typography>
                </Box>
              )}
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Chip
                    label={coupon.type.toUpperCase()}
                    color={getChipColor(coupon.type)}
                    size="small"
                  />
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/edit/${coupon._id}`)}
                      sx={{ 
                        color: customTheme.colors.primary.main,
                        '&:hover': {
                          backgroundColor: customTheme.colors.primary.light
                        }
                      }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ 
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.lighter'
                        }
                      }}
                      onClick={() => handleDelete(coupon._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography 
                  variant="body1" 
                  gutterBottom
                  sx={{ color: customTheme.colors.text.primary }}>
                  {formatCouponDetails(coupon)}
                </Typography>

                <Typography 
                  variant="caption"
                  sx={{ 
                    color: isExpired(coupon.expiryDate) 
                      ? 'error.main' 
                      : customTheme.colors.text.secondary
                  }}
                >
                  Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {coupons.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" sx={{ color: customTheme.colors.text.secondary }}>
            No coupons available
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default CouponList;
