class ApiClient {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API;
    this.apiPrefix = '/api';
    this.token = null;
    
    // Solo en cliente
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('laravel_token') || null;
    }
  }

  buildUrl(endpoint) {
    if (endpoint.startsWith(this.apiPrefix)) {
      return `${this.baseUrl}${endpoint}`;
    }
    return `${this.baseUrl}${this.apiPrefix}${endpoint}`;
  }

  async request(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    
    // Configuración por defecto de headers
    const headers = {
      'Accept': 'application/json',
      ...options.headers
    };
    
    // Obtener token de localStorage (por si el componente se recargó)
    const storedToken = localStorage.getItem('laravel_token');
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
      this.token = storedToken; // Sincronizar con la instancia
    }
    
    // Configuración de Content-Type (excepto para FormData)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Para cookies de sesión
        signal: options.signal || AbortSignal.timeout(15000) // Timeout de 15s
      });
  
      // Manejo de respuestas no exitosas
      if (!response.ok) {
        // Caso especial: No autorizado (401)
        if (response.status === 401) {
          this.clearAuth();
          // Redirigir solo si no estamos ya en login
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
          return null;
        }
        
        // Intentar parsear el error como JSON
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        
        // Lanzar error con información útil
        const error = new Error(errorData.message || `HTTP error ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
  
      // Manejar respuestas vacías (204 No Content)
      if (response.status === 204) {
        return null;
      }
  
      // Parsear respuesta JSON
      try {
        return await response.json();
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        throw new Error('Invalid JSON response from server');
      }
      
    } catch (error) {
      console.error(`API Request failed to ${url}:`, error);
      
      // Manejar errores específicos
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      // Relanzar error con contexto adicional
      error.endpoint = endpoint;
      throw error;
    }
  }

  // Guardar datos de autenticación
  setAuth(token, userData) {
    this.token = token;
    localStorage.setItem('laravel_token', token);
    localStorage.setItem('laravel_user', JSON.stringify(userData));
  }

  // Limpiar datos de autenticación
  clearAuth() {
    this.token = null;
    localStorage.removeItem('laravel_token');
    localStorage.removeItem('laravel_user');
  }

  // Obtener usuario actual
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('laravel_user');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      this.clearAuth();
      return null;
    }
  }

  // Métodos de autenticación
  async login(credentials) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Guardar datos de autenticación
    this.setAuth(data.token, data.user);
    return data;
  }

  // Métodos de autenticación
  async register(credentials) {
    const data = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Guardar datos de autenticación
    this.setAuth(data.token, data.user);
    return data;
  }

  async logout() {
    try {
      await this.request('/logout', {
        method: 'POST'
      });
    } finally {
      this.clearAuth();
    }
  }
  
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  async searchProducts(params = {}) {
    const query = new URLSearchParams();
    
    if (params.name) query.append('name', params.name);
    if (params.sku) query.append('sku', params.sku);
    if (params.min_price) query.append('min_price', params.min_price);
    if (params.max_price) query.append('max_price', params.max_price);
    
    return this.request(`/search?${query.toString()}`);
  }

  // ======================
  // Administración
  // ======================
  async getAdminProducts() {
    return this.request('/admin/products');
  }

  async getSellers() {
    return this.request('/sellers');
  }

  // ======================
  // Carrito de Compras
  // ======================
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      })
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeCartItem(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiClient();