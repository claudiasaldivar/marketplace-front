'use client';
import Link from 'next/link';

export default function ProductList({ products, onDelete }) {

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {products.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No hay productos registrados
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {products?.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {product.name}
                        </p>
                        <p className="ml-2 text-sm text-gray-500 truncate">
                          (SKU: {product.sku})
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <p>
                            Cantidad: <span className="font-medium">{product.quantity}</span>
                          </p>
                          <p className="ml-4">
                            Precio: <span className="font-medium">${Number(product.price).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Link href={`/products/${product.id}`}>
                      <button className="mr-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}