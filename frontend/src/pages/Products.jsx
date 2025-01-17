import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/couponSlice';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import customTheme from '../theme';

function Products() {
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  
  const handleAddToCart = (product) => {
    dispatch(addToCart({ product }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: customTheme.colors.background.default }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          fontWeight: 600,
          color: customTheme.colors.text.primary
        }}
      >
        Products
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${customTheme.colors.divider}`,
                backgroundColor: customTheme.colors.background.paper,
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  '& .MuiCardMedia-root': {
                    transform: 'scale(1.05)'
                  }
                }
              }}
            >
              <Box sx={{ 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: customTheme.colors.background.secondary
              }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    height: 240,
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </Box>

              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 3
              }}>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: customTheme.colors.text.primary,
                    fontSize: '1.1rem',
                    mb: 1
                  }}
                >
                  {product.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2,
                    color: customTheme.colors.text.secondary,
                    flexGrow: 1
                  }}
                >
                  {product.description}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: customTheme.colors.text.primary,
                    mb: 2,
                    fontSize: '1.25rem'
                  }}
                >
                  ₹{product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(product)}
                  sx={{
                    py: 1.5,
                    backgroundColor: customTheme.colors.primary.main,
                    color: customTheme.colors.background.default,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: customTheme.colors.primary.dark
                    }
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Products;
