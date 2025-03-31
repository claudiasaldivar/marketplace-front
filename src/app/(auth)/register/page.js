'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../_components/Layout';
import { api } from '../../_lib/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('seller');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      // Validación de contraseñas
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
      }
  
      // Registro del usuario
      const result = await api.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        role
      });
  
      // Redirección según el rol
      if (result?.user?.role === 'admin') {
        router.push('/admin/products');
      } else if (result.user.role === 'buyer'){
        router.push('/cart');
      } else {
        router.push('/products');
      }
  
    } catch (error) {
      // Manejo de errores      
      if (error.response?.data?.errors) {
        // Si hay errores de validación del backend
        const backendErrors = Object.values(error.response.data.errors).flat();
        setError(backendErrors.join('\n'));
      } else {
        // Para otros tipos de errores
        setError(error.message || 'Ocurrió un error durante el registro');
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-32">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Registrarse</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Rol
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="seller">Vendedor</option>
              <option value="buyer">Comprador</option>
              <option value="admin">Comprador</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Registrarse
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}