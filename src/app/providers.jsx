'use client'
import { AuthProvider } from './_lib/auth'

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}