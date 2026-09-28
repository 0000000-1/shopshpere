import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cart, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    try {
      const orderPayload = {
        products: cart.map(item => ({ product: item.productId._id, quantity: item.quantity })),
        shippingAddress: address,
        totalPrice: getSubtotal()
      };
      await createOrder(orderPayload);
      alert('Order placed successfully! Transaction record synchronized.');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to forward order. Verify schema properties packet.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Complete Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmitOrder} className="bg-white border p-6 rounded-xl space-y-4 shadow-sm">
          <h3 className="font-semibold text-zinc-800">Shipping Vector Parameters</h3>
          <input 
            type="text" placeholder="Street Address" required
            className="w-full border p-2.5 rounded-lg text-sm bg-zinc-50"
            onChange={e => setAddress({...address, street: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="City" required
              className="w-full border p-2.5 rounded-lg text-sm bg-zinc-50"
              onChange={e => setAddress({...address, city: e.target.value})}
            />
            <input 
              type="text" placeholder="ZIP Code" required
              className="w-full border p-2.5 rounded-lg text-sm bg-zinc-50"
              onChange={e => setAddress({...address, zip: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl cursor-pointer">
            Authorize Order
          </button>
        </form>

        <div className="bg-zinc-50 p-6 border rounded-xl h-fit">
          <h3 className="font-semibold text-zinc-800 mb-4">Summary</h3>
          <div className="space-y-2 text-sm border-b pb-4 mb-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-zinc-600">
                <span>{item.productId.title} ({item.quantity})</span>
                <span>${(item.productId.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-base text-zinc-900">
            <span>Total Payable</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
