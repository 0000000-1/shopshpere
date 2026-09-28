function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item || {};
  const { title, price } = product || {};

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl shadow-sm gap-4">
      {/* Product Information Title */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-16 h-16 bg-zinc-100 rounded-lg flex items-center justify-center text-xl shrink-0">
          📦
        </div>
        <div>
          <h4 className="font-bold text-zinc-800 line-clamp-1 text-base">{title || 'Product'}</h4>
          <p className="text-zinc-500 text-sm font-medium">${price || 0} each</p>
        </div>
      </div>

      {/* Quantity Adjustment Tools & Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
        <div className="flex items-center border border-zinc-300 rounded-lg bg-zinc-50 overflow-hidden h-9">
          <button
            onClick={onDecrease}
            className="px-3 text-zinc-600 hover:bg-zinc-200 text-base font-bold transition-colors cursor-pointer h-full"
          >
            -
          </button>
          <span className="px-3 text-sm font-bold text-zinc-800 min-w-[32px] text-center">{quantity}</span>
          <button
            onClick={onIncrease}
            className="px-3 text-zinc-600 hover:bg-zinc-200 text-base font-bold transition-colors cursor-pointer h-full"
          >
            +
          </button>
        </div>

        {/* Individual Row Calculations Area */}
        <div className="text-right min-w-[70px]">
          <span className="text-base font-extrabold text-zinc-900">${((price || 0) * (quantity || 0)).toFixed(2)}</span>
        </div>

        {/* Trash Delete Action Button Trigger */}
        <button
          onClick={onRemove}
          className="text-zinc-400 hover:text-red-500 text-lg p-1 transition-colors cursor-pointer"
          title="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default CartItem;
