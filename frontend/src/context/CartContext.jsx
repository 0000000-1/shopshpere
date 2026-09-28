import { createContext, useState, useEffect, useContext } from 'react';
import { addCart, deleteCart, fetchCart } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const LoadCart = async () => {
      const res = await fetchCart()
      setCart(res.data?.cartItems || [])// or whatever key your getCart controller sends back
    };
    LoadCart()
  }, [])

  const addToCart = async (product, quantity) => {
    if (!product || !product._id) {
      console.error("Cart Aborted: The product package is missing its Mongoose _id parameter.", product);
      return;
    }
    try {
      const res = await addCart({ productId: product._id, quantity: quantity })
      setCart(res.data?.user?.cartItems) 
    } catch (error) {
      console.error("failed ", error)
    }
  };

  const updateQuantity = async(productId, amt) => {
    if(!productId){
        console.error("Cart Aborted: The product package is missing its Mongoose _id parameter.");
      return;
    }
    try {
        const res = await addCart({ productId: productId, quantity: amt})
        setCart(res.data?.user?.cartItems)
    } catch (error) {
      console.error("failed", error);
    }
  };

  const removeFromCart = async (productId) => {
    // Guard Clause: Instantly stop if a bad or missing ID is passed
    if (!productId) {
      console.error("Cart Aborted: Missing valid product identifier.");      
      return;
    }
    try {
      const res = await deleteCart(productId)
      console.log('product item send for removal');

      if (res.data?.cartItems) {
        setCart(res.data.cartItems)
        console.log(res.data.cartItems);
      }

    } catch (error) {
      console.error("Failed to remove item from server cart:", error.response?.data?.error || error.message);
      alert("Could not remove item. Please check your connection and try again.");
    }
  };

  const clearCart = () => setCart([]);

  // 💡 FIX: Added safe item calculation guards to protect subtotal calculations
  const getSubtotal = () => cart.reduce((acc, item) => acc + ((item?.productId?.price || 0) * (item?.quantity || 0)), 0);
  const getCartCount = () => cart.reduce((acc, item) => acc + (item?.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateQuantity, removeFromCart, clearCart, getSubtotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
