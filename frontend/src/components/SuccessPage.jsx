// src/components/SuccessPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../services/api";

const SuccessPage = () => {
// calls it once on mount  // verifying | success | error
 const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return setStatus("error");

    API.get(`/payment/verify-session?session_id=${sessionId}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [searchParams]);

  if (status === "verifying") return <p>Confirming your payment...</p>;
  if (status === "error") return <p>Something went wrong. Contact support.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-emerald-600 mb-2">🎉 Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Your payment was securely processed in Indian Rupees (INR) via Stripe.</p>
        <div className='flex gap-4'>
          <Link to="/myorders" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">View your orders</Link>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SuccessPage;