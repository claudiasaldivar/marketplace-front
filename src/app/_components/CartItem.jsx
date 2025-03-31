'use client';

export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem 
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
  };

  const handleUpdate = () => {
    if (quantity !== item.quantity) {
      setIsUpdating(true);
      onUpdateQuantity(item.id, quantity)
        .finally(() => setIsUpdating(false));
    }
  };

  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <p className="text-sm font-medium text-blue-600 truncate">
                  {item.product.name}
                </p>
                <p className="ml-2 text-sm text-gray-500 truncate">
                  (SKU: {item.product.sku})
                </p>
              </div>
              <div className="mt-2 flex">
                <div className="flex items-center text-sm text-gray-500">
                  <p>
                    Precio unitario: <span className="font-medium">${item.price.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex items-center">
            <div className="mr-4">
              <label htmlFor={`quantity-${item.id}`} className="sr-only">Cantidad</label>
              <input
                type="number"
                min="1"
                id={`quantity-${item.id}`}
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleUpdate}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                disabled={isUpdating}
              />
            </div>
            <div className="text-sm font-medium text-gray-900">
              ${(item.price * quantity).toFixed(2)}
            </div>
            <button
              onClick={() => onRemoveItem(item.id)}
              disabled={isUpdating}
              className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}