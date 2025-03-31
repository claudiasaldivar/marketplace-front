'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../_lib/api';
import Layout from '../../_components/Layout';
import CartItem from '../../_components/CartItem';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario al cargar la página
    const user = api.getCurrentUser();
    
    if (!user) {
      setError('No has iniciado sesión');
      setLoading(false);
      router.push('/login'); // Redirigir a login si no hay usuario
      return;
    }
    
    setCurrentUser(user);
    
    const loadCart = async () => {
      try {
        const data = await api.getCart();
        setCart(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [router]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await api.updateCartItem(itemId, newQuantity);
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.removeCartItem(itemId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  if (!currentUser) {
    return null; // O puedes mostrar un loader aquí
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Cargando carrito...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi Carrito</h1>
        
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

        {cart?.items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">Tu carrito está vacío</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Buscar productos
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {cart?.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </ul>
            <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-between items-center">
              <div className="text-lg font-medium text-gray-900">
                Total: ${cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => router.push('/checkout')}
              >
                Proceder al pago
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}