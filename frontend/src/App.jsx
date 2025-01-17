import { Routes, Route } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import customTheme from './theme';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import CouponList from './pages/CouponList';
import CreateCoupon from './pages/CreateCoupon';
import EditCoupon from './pages/EditCoupon';
import Cart from './pages/Cart';

function App() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: customTheme.colors.background.paper
    }}>
      <CssBaseline />
      <Navbar />
      <Container 
        component="main" 
        sx={{ 
          mt: 4, 
          mb: 4, 
          flex: 1,
          maxWidth: { sm: '100%', md: '1200px' }
        }}
      >
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/coupons" element={<CouponList />} />
          <Route path="/create" element={<CreateCoupon />} />
          <Route path="/edit/:id" element={<EditCoupon />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
