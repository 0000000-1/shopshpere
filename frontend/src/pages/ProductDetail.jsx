import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  // 1. EXTRACT PARAMS AND NAVIGATION TOOLS
  const { id } = useParams(); // Extracts the unique ID from '/product/:id'
  const navigate = useNavigate();

  // 2. DEFINE REACT STATES
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 3. FETCH SINGLE PRODUCT DATA ON LOAD
  useEffect(() => {
    fetchProductById(id)
      .then((res) => {

        setProduct(res.data.product || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setError("Could not retrieve details for this product.");
        setLoading(false);
      });
  }, [id]);

  // Quantity control helpers
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => setQuantity(quantity + 1);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  // 4. LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium">Fetching product particulars...</p>
      </div>
    );
  }

  // 5. ERROR STATE
  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
        <span className="text-3xl">🔍</span>
        <h3 className="text-lg font-bold text-amber-800 mt-2">Product Not Found</h3>
        <p className="text-amber-600 text-sm mt-1">{error || "This item does not exist."}</p>
        <Link to="/" className="inline-block mt-4 text-sm font-semibold text-zinc-900 underline hover:text-emerald-500">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // 6. MAIN CONTENT RENDER
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 text-sm text-zinc-500">
        <Link to="/" className="hover:text-emerald-500">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800 font-medium">{product.title}</span>
      </nav>

      {/* Product Display Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-8 border border-zinc-200 rounded-2xl shadow-sm">
        
        {/* Left Side: Product Image Container */}
        <div className="w-full h-80 sm:h-96 md:h-112.5 bg-zinc-100 rounded-xl flex flex-col items-center justify-center text-zinc-400 font-medium">
          <span className="text-6xl mb-2">📦</span>
          <span className="text-sm uppercase tracking-widest text-zinc-500">High-Res Product Display</span>
        </div>

        {/* Right Side: Product Meta Details Data Information Block */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
              {product.title}
            </h1>
            
            {/* Hardcoded Category badge placeholder */}
            <span className="inline-block bg-zinc-100 text-zinc-800 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider mb-6">
              Premium Collection
            </span>

            <div className="border-t border-b border-zinc-100 py-4 mb-6">
              <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold block mb-1">Price</span>
              <span className="text-3xl font-black text-zinc-900">${product.price}</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                {product.description || "No description provided for this specific items portfolio asset profile catalog log entry description metadata parameters packet."}
              </p>
            </div>
          </div>

          {/* Action Row Panel Controls Area */}
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <div className="flex flex-wrap items-center gap-6">
              {/* Quantity Counter Tool */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Quantity</span>
                <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-zinc-50 h-11">
                  <button 
                    onClick={handleDecrease}
                    className="px-4 text-zinc-600 hover:bg-zinc-200 transition-colors text-lg font-bold cursor-pointer h-full"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-zinc-800 min-w-10 text-center">{quantity}</span>
                  <button 
                    onClick={handleIncrease}
                    className="px-4 text-zinc-600 hover:bg-zinc-200 transition-colors text-lg font-bold cursor-pointer h-full"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add To Cart Primary Button Action Trigger */}
              <div className="flex-1 min-w-50 pt-5">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-zinc-900 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-wider transition-colors shadow-md transform active:scale-[0.98] cursor-pointer"
                >
                  Add To Shopping Cart
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
