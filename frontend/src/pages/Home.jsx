import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api'; // Adjust path if needed

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        // Axios automatically returns data inside res.data
        //  console.log("Backend response data:", res.data);
        // setProducts(res.data);
        if(res.data && Array.isArray(res.data.allProducts)){
          setProducts(res.data.allProducts)
        }else{
          console.error("Expected an 'allProducts' array but got:", res.data)
        setError("Received malformed product data from the server.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Backend fetch error:", err);
        setError("Unable to load store products. Ensure your backend server is running.");
        setLoading(false);
      });
  }, []);

  // 1. LOADING STATE DISPLAY
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium animate-pulse">Loading products from marketplace...</p>
      </div>
    );
  }

  // 2. ERROR STATE DISPLAY
  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-bold text-red-800 mt-2">Connection Failure</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  // 3. SUCCESS STATE DISPLAY
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner / Hero Section */}
      <div className="bg-gradient-to-red from-zinc-900 to-zinc-800 rounded-2xl p-8 mb-12 text-white shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Welcome to <span className="text-emerald-400">ShopSphere HUB</span>
        </h1>
        <p className="text-zinc-300 max-w-xl text-sm sm:text-base">
          Discover handpicked premium products dispatched instantly to your doorstep. Secure shopping with live order tracking.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 mb-6 tracking-tight">Featured Collections</h2>

      {/* Empty Database State Fallback */}
      {products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
          <p className="text-zinc-500 font-medium">Your marketplace catalog is currently empty.</p>
          <p className="text-zinc-400 text-xs mt-1">Add items to MongoDB using your admin panel dashboard.</p>
        </div>
      ) : (
        /* Product Item Grid Display System */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="group bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Visual Product Box Placeholder (Update with product.image url path later) */}
                <div className="w-full h-48 bg-zinc-100 rounded-lg mb-4 flex flex-col items-center justify-center text-zinc-400 font-medium group-hover:bg-zinc-200 transition-colors">
                  <span className="text-3xl mb-1">📦</span>
                  <span className="text-xs uppercase tracking-wider text-zinc-500">Preview Available</span>
                </div>

                {/* Text Context Content Block */}
                <h3 className="text-base font-bold text-zinc-800 group-hover:text-emerald-500 transition-colors line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2 min-h-8">
                  {product.description}
                </p>
              </div>

              {/* Functional Card Footing Pricing Panel */}
              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Price</span>
                  <span className="text-lg font-extrabold text-zinc-900">${product.price}</span>
                </div>
                <Link
                  to={`/product/${product._id}`}
                  className="bg-zinc-900 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-wider transition-colors shadow-sm"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
