'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../_lib/auth';
import { api } from '../_lib/api';
import Layout from '../_components/Layout';
import ProductCard from '../_components/ProductCard';
import SearchFilters from '../_components/SearchFilters';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    sku: '',
    min_price: '',
    max_price: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await api.searchProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    // El efecto se disparará cuando filters cambie
  };

  const addToCart = async (productId) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      await api.addToCart({ product_id: productId, quantity: 1 });
      alert('Producto agregado al carrito');
    } catch (error) {
      alert('Error al agregar al carrito: ' + error.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Productos Disponibles</h1>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <SearchFilters 
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}