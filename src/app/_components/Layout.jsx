'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '../_lib/api';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Obtener usuario al cargar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('laravel_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Si está en login o register, mostrar solo el children
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Marketplace
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  {user.role === 'seller' && (
                    <Link href="/products" className="px-3 py-2 text-sm font-medium text-dark">
                      Mis Productos
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin/products" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      Administración
                    </Link>
                  )}
                  <Link href="/cart" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Carrito
                  </Link>
                  <span className="ml-4 text-sm font-medium text-gray-700">
                    Hola, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Iniciar sesión
                  </Link>
                  <Link href="/register" className="ml-4 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}