'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../_components/Layout';
import { api } from '../../_lib/api';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await api.login({ email, password });
      
      // Redireccionar según el rol del usuario
      if (result.user.role === 'admin') {
        router.push('/admin/products');
      } else if (result.user.role === 'buyer'){
        router.push('/cart');
      } else {
        router.push('/products');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Credenciales incorrectas');
    }
  };
  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-32">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Iniciar sesión</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} method='POST'>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="text-blue-500 hover:text-blue-700">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}