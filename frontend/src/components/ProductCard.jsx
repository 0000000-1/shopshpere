import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // Safe destructuring with fallback variables
  const { _id, title, price, description } = product || {};

  return (
    <div className="group bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Product Media Box Placeholder */}
        <div className="w-full h-48 bg-zinc-100 rounded-lg mb-4 flex flex-col items-center justify-center text-zinc-400 font-medium group-hover:bg-zinc-200 transition-colors">
          <span className="text-3xl mb-1">📦</span>
          <span className="text-xs uppercase tracking-wider text-zinc-500">Preview Image</span>
        </div>

        {/* Info Area */}
        <h3 className="text-base font-bold text-zinc-800 group-hover:text-emerald-500 transition-colors line-clamp-1">
          {title || 'Unnamed Item'}
        </h3>
        <p className="text-zinc-500 text-xs mt-1 line-clamp-2 min-h-8">
          {description || 'No description summary available.'}
        </p>
      </div>

      {/* Pricing Footing Action Block */}
      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Price</span>
          <span className="text-lg font-extrabold text-zinc-900">${price || 0}</span>
        </div>
        <Link
          to={`/product/${_id}`}
          className="bg-zinc-900 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-wider transition-colors shadow-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
