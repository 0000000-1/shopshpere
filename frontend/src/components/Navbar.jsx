import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';       // 💡 Added real auth context hook
import { useCart } from '../context/CartContext';       // 💡 Added real cart context hook

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 💡 Linked to real dynamic context data instead of old hardcoded mock fields
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  const handleLogout = () => {
    logout(); // 💡 Triggers your real auth logout function to wipe localStorage values
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-zinc-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-emerald-400">⚡ ShopSphere</Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link className="text-gray-300 hover:text-gray-100"> {user ? user.name : 'Guest'}</Link>
          
          <Link to='/myorders' className="block text-gray-300 hover:text-gray-100 "> MyOrders</Link>
          <Link to="/" className="text-gray-300 hover:text-emerald-400">Shop</Link>
          
          {/* 💡 Shows Admin Portal option only if logged-in user has role property as true */}
          {user?.role === 'admin' && <Link to="/admin" className="text-amber-400">Admin</Link>}
          
          {/* 💡 Displays real-time quantity number tracking using cart context loop counter helper */}
          <Link to="/cart" className="relative">🛒 Cart ({getCartCount()})</Link>
          
          {/* 💡 Toggles UI elements seamlessly depending on active authentication tokens */}
          {user ? (
            <button onClick={handleLogout} className="text-red-400 cursor-pointer font-medium">Logout</button>
          ) : (
            <Link to="/login" className="bg-emerald-500 hover:bg-emerald-400 px-3 py-1 rounded font-medium transition-colors">Login</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>☰</button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-800 p-4 space-y-2">
          <Link className="block text-gray-300 hover:text-gray-100 uppercase"> {user ? user.name : 'Guest'}</Link>
          
          <Link className="block text-gray-300 hover:text-gray-100 uppercase"> My-Orders</Link>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block">Shop</Link>
          {user?.role && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-amber-400">Admin</Link>}
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block">Cart ({getCartCount()})</Link>
          {user ? (
            <button onClick={handleLogout} className="w-full text-left text-red-400 font-medium">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-emerald-400 font-medium">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
