import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, isAdminRequired = 'user' }) { // admin should not be able to see checkout only user
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner if you prefer

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminRequired && user.role !== isAdminRequired) {
    alert('Access Denied: Administrative access required.');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
// 1. Who can access the checkout page?Only the normal user (buyer) should be able to access the checkout page and place orders.
// An admin user does not buy products; their only job is to manage the catalog (add/delete items). 
// In fact, you should block the admin from even seeing the "Checkout" button to keep your roles clean.
// 2. When should the order be placed in the database?The order must be placed after the checkout/payment simulation, 
// never when adding items to the cart.Adding to Cart: This only updates the frontend state (or local storage). 
// No data is saved to the database yet. The user is just "shopping."Clicking "Place Order" (Checkout): 
// This triggers the API call (POST /api/orders) to save the final purchase details into MongoDB. 
// Once successful, the frontend cart is cleared.
// 3. When should the user see their orders?The user should see their past orders on a dedicated "My Orders" page or profile tab.
// As soon as the checkout is successful, you can automatically redirect them to this page so they can see their newly placed order sitting at the top of the list.

// [User adds items] ➔ Saved to Frontend LocalStorage (No DB impact)
//         ↓
// [User clicks Checkout] ➔ Frontend sends Cart Array to Backend (POST /api/orders)
//         ↓
// [Backend processes] ➔ Creates Order Document in MongoDB ➔ Sends success response
//         ↓
// [Frontend receives success] ➔ Clears LocalStorage ➔ Redirects user to "My Orders" page