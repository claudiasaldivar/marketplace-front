'use client';
import { useAuth } from '../_lib/auth';
import { fetchWithAuth } from '../_lib/api';

export default function ProductCard({ product }) {
  const { user } = useAuth();

  const addToCart = async () => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      await fetchWithAuth('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      });
      alert('Producto agregado al carrito');
    } catch (error) {
      alert('Error al agregar al carrito: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
        <div className="mt-2 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Disponibles: {product.quantity}</p>
            <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
          </div>
          {product.user && (
            <p className="text-sm text-gray-500">Vendedor: {product.user.name}</p>
          )}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        {user?.role === 'seller' && user.id === product.user_id ? (
          <a
            href={`/products/${product.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Editar
          </a>
        ) : (
          <button
            onClick={addToCart}
            className="text-sm font-medium text-green-600 hover:text-green-500"
            disabled={!user}
          >
            Agregar al carrito
          </button>
        )}
      </div>
    </div>
  );
}