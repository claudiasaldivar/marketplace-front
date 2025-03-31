'use client';
import { useState, useEffect } from 'react';
import { api } from '../../_lib/api';
import Layout from '../../_components/Layout';
import ProductForm from '../../_components/ProductForm';
import ProductList from '../../_components/ProductList';

export default function Products() {

  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario al cargar la página
    const user = api.getCurrentUser();
    
    if (!user) {
      setError('No has iniciado sesión');
      setLoading(false);
      return;
    }
    
    setCurrentUser(user);
    // Verificar rol de usuario
    if (user?.role === 'seller') {
      fetchProducts();
    } else {
      setError(`Acceso denegado: Tu rol (${user?.role || 'desconocido'}) no tiene permiso para ver esta página`);
      setLoading(false);
    }
  }, []);

  // Función para obtener productos
  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();

      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (productData) => {
    try {
      const newProduct = await api.createProduct(productData);
      setProducts([...products, newProduct]);
      setShowForm(false);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Mis Productos</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {showForm ? 'Cancelar' : 'Agregar Producto'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <ProductForm 
              onSubmit={handleCreate} 
              onCancel={() => {
                setShowForm(false);
                setError('');
              }} 
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <ProductList 
              products={products} 
              onDelete={handleDelete} 
              onRefresh={fetchProducts}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}