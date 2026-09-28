import React, { useState, useEffect } from "react";
import Order from "../components/Order";
import { myOrders } from "../services/api";

const OrderPage = () => {
  const [orders, setOrders] = useState([]); // Renamed to plural 'orders' for cleaner logic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchingOrders = async () => {
      try {
        const res = await myOrders();
        // Fallback to res.data.orders if your API wraps the array inside an object property
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
      } catch (err) {
        const errMsg = err.response?.data?.message || "Could not load orders. Please try again.";
        console.error(errMsg);
        setError(errMsg); // ✅ FIX: Now correctly triggers the error UI block
      } finally {
        setLoading(false);
      }
    };
    fetchingOrders();
  }, []);

  // Loading Skeleton State UI
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-6"></div>
        <div className="h-40 w-full bg-slate-100 rounded-xl animate-pulse"></div>
        <div className="h-40 w-full bg-slate-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center my-12">
        <div className="inline-flex p-3 bg-red-50 text-red-600 rounded-full mb-3">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-800">Failed to Load Orders</h3>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      {/* Heading Section */}
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          My Orders {/* ✅ FIX: Fixed apostrophe typo */}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          View and track your transaction history
        </p>
      </div>

      {/* Orders Conditional Render list */}
      {orders.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((item) => (
            <Order key={item._id} order={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
