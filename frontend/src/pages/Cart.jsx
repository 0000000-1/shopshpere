import CheckoutButton from '../components/CheckoutButton';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, updateQuantity, removeFromCart, getSubtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-center">
        <span className="text-4xl block mb-3">🛒</span>
        <h3 className="text-lg font-bold text-zinc-800">Your bag is empty</h3>
        <p className="text-zinc-500 text-sm mt-1 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/" 
          className="inline-block bg-zinc-900 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-extrabold text-zinc-900 mb-8 tracking-tight">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Product Rows with Active Update Triggers */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const productId = item?.productId;
            const productIds = productId?._id || index;
            
            return (
              <div key={productIds} className="bg-white border p-4 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-zinc-900 text-base">
                    {productId?.title || productId?.name || "Unknown Product"}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Price: ${productId?.price || 0}</p>
                  
                  {/* 💡 FIX: Added action button to easily clean out single lines */}
                  <button 
                    onClick={() => removeFromCart(productId?._id)}
                    className="text-xs text-red-400 hover:text-red-500 underline mt-2 cursor-pointer block"
                  >
                    Remove Item
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* 💡 FIX: Interactive Quantity Controls linked to your Context handlers */}
                  <div className="flex items-center border rounded-lg overflow-hidden bg-zinc-50">
                    <button 
                      onClick={() => updateQuantity(productId?._id, -1)}
                      className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-200 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-semibold text-zinc-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(productId?._id, 1)}
                      className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-200 font-bold"
                    >
                      +
                    </button>
                  </div>
                  
                  <span className="font-bold text-zinc-900 text-sm min-w-[70px] text-right">
                    ${((productId?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Calculation Sidebar Card */}
        <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-2xl h-fit shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-800 text-base uppercase tracking-wider border-b border-zinc-200 pb-3">
            Order Summary
          </h3>
          
          <div className="space-y-2.5 text-sm text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-500 font-medium">FREE</span>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-4 flex justify-between items-center font-extrabold text-zinc-900 text-lg">
            <span>Estimated Total</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>


        {/* 🚀 Render your modular payment button right here */}
        <CheckoutButton cartItems={cart} />
          {/* <div className="pt-2">
            <Link 
              to="/checkout" 
              className="block text-center w-full bg-zinc-900 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl uppercase tracking-wider text-xs transition-colors shadow-sm cursor-pointer"
            >
              Proceed To Checkout
            </Link>
          </div> */}
        </div>

      </div>
    </div>
  );
}

export default Cart;
