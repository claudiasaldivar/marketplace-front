'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // In your AuthProvider.js file
const login = async (email, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API}/login`, {
      method: 'POST', // Ensure this is set to POST
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('laravel_token', data.token);
    localStorage.setItem('laravel_user', JSON.stringify(data.user));

    // Return the data so the login component knows it succeeded
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};
  const logout = async () => {
    try {
      // Opcional: llamar a endpoint de logout si lo tienes
      await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      // Limpiar estado y localStorage
      setToken(null)
      setUser(null)
      localStorage.removeItem('laravel_token')
      localStorage.removeItem('laravel_user')
      router.push('/login')
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}