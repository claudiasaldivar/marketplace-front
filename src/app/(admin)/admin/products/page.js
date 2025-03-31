'use client';
import { api } from '../../../_lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/_components/Layout';
import SearchFilters from '@/app/_components/SearchFilters';
import ProductList from '@/app/_components/ProductList';

export default function AdminProducts() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [sellers, setSellers] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    name: '',
    sku: '',
    min_price: '',
    max_price: ''
  });

  useEffect(() => {
    const user = api.getCurrentUser();
    
    if (!user) {
      setError('No has iniciado sesión');
      setLoading(false);
      return;
    }
    
    setCurrentUser(user);
    if (user?.role === 'admin') {
      fetchProducts();
      fetchSellers();
    } else {
      setError(`Acceso denegado: Tu rol (${user?.role || 'desconocido'}) no tiene permiso para ver esta página`);
      setLoading(false);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getAdminProducts();
      setProducts(data?.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const data = await api.getSellers();
      setSellers(data);
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const filteredProducts = await api.searchProducts(filters);
      setProducts(filteredProducts);
    } catch (err) {
      setError(err.message);
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

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Administración de Productos</h1>
        
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <SearchFilters 
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Filtrar por vendedor</label>
            <select
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filters.seller_id || ''}
              onChange={(e) => setFilters({...filters, seller_id: e.target.value})}
            >
              <option value="">Todos los vendedores</option>
              {sellers.map(seller => (
                <option key={seller.id} value={seller.id}>
                  {seller.name} ({seller.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <ProductList 
            products={products} 
            showSeller={true}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
}