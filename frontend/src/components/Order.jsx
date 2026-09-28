import React from 'react';

const Order = ({ order }) => {
  // Dynamic shipment badge colors
  const getShipmentColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200'; // Processing
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Top Banner Row */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</p>
          <p className="text-sm font-mono font-medium text-slate-800">#{order._id || 'N/A'}</p>
        </div>
        
        <div className="hidden sm:block text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            ● {order.paymentStatus}
          </span>
        </div>
        
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Shipment Status</p>
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${getShipmentColor(order.status)}`}>
            {order.status || 'Processing'}
          </span>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Richer Items List */}
        <div className="md:col-span-2 space-y-4 divide-y divide-slate-100">
          {order.products.map((item) => (
            <div key={item._id} className="flex items-center justify-between pt-4 first:pt-0">
              <div className="flex items-center gap-4">
                {/* Visual Anchor: Minimalist fallback image circle */}
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-sm">
                  {item.product?.name ? item.product.name.charAt(0).toUpperCase() : 'P'}
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900">{item.product?.name || 'Item Name'}</p>
                  <p className="text-xs text-slate-500">
                    ₹{item.price} <span className="mx-1.5 text-slate-300">|</span> Qty: <span className="font-medium text-slate-700">{item.quantity}</span>
                  </p>
                </div>
              </div>
              
              <p className="text-sm font-bold text-slate-800">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side: Total Summary Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Summary</p>
          
          <div className="flex justify-between text-sm text-slate-600">
            <span>Total Quantity</span>
            <span className="font-semibold text-slate-800">
              {order.products.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          </div>
          
          {/* Mobile Fallback view for payment status */}
          <div className="flex justify-between text-sm text-slate-600 sm:hidden">
            <span>Payment</span>
            <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
              {order.paymentStatus}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-800">Total Paid</span>
            <span className="text-2xl font-black text-slate-900">₹{order.totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Order;
