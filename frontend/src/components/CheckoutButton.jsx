import { useState } from "react";
import API from "../services/api";

const CheckoutButton = ({ cartItems }) => {
    const [loading, setLoading] = useState(false)

    const handleCheckout = async (e) => {
        e.preventDefault()
        if (cartItems.length === 0) return alert('your cart is empty!')

        setLoading(true)
        
        try {
            const response = await API.post('/payment/create-checkout-session', {
                cartItems,
            })
            if (response.data.url) {
                window.location.href = response.data.url
            }
        } catch (error) {
            console.error('Payment Error:', error.response?.data?.message || error.message);
            alert(error.response?.data?.message || 'Authentication or network payment failed.');
        } finally {
            setLoading(false);
        }
    }
    return (

        <button
            onClick={handleCheckout}
            disabled={loading || cartItems.length === 0}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white transition duration-200 ${loading || cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
        >   {loading ? 'Processing Transaction...' : 'Pay with Stripe (INR)'}
        </button>
    )
}


export default CheckoutButton;