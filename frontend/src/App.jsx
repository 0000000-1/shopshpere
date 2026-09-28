import { Routes, Route, Navigate } from 'react-router-dom';

// Structure Modules
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// View Panes
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import SuccessPage from './components/SuccessPage.jsx';
import OrderPage from './pages/OrderPage.jsx';

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans antialiased">
      {/* Sticky Global Top Header Menu */}
      <Navbar />

      {/* Primary Dynamic Display Port */}
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          {/* Public Storefront Paths */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/checkout-success" element={<SuccessPage/>} />
          
          <Route path="/myorders" element={<OrderPage/>} />
          
          {/* Secured Transaction Paths */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          
          {/* Highly Privileged Database Control Desks */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute isAdminRequired={'admin'}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Automatic URL Typo Safety Net */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
