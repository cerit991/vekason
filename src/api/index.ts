const API_URL = 'http://localhost:3000/api';

// Temel API çağrıları için yardımcı fonksiyonlar
async function fetchJSON(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Bir hata oluştu' }));
    throw new Error(error.error || 'İşlem sırasında bir hata oluştu');
  }

  return response.json();
}

// Categories
export const fetchCategories = () => fetchJSON('/categories');
export const createCategory = (category: { name: string; description: string }) => 
  fetchJSON('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });

// Brands
export const fetchBrands = () => fetchJSON('/brands');
export const createBrand = (brand: { name: string; description: string }) => 
  fetchJSON('/brands', {
    method: 'POST',
    body: JSON.stringify(brand),
  });

// Products
export const fetchProducts = () => fetchJSON('/products');

export async function createProduct(product: any, imageFile: File | null) {
  if (!imageFile) {
    throw new Error('Lütfen bir resim seçin');
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(product));
  formData.append('image', imageFile);

  return fetchJSON('/products', {
    method: 'POST',
    body: formData,
  });
}

export async function updateProduct(product: any, imageFile: File | null) {
  const formData = new FormData();
  formData.append('data', JSON.stringify(product));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return fetchJSON(`/products/${product.id}`, {
    method: 'PUT',
    body: formData,
  });
}

export const deleteProduct = (id: number) => 
  fetchJSON(`/products/${id}`, {
    method: 'DELETE',
  });

// Orders
export const fetchOrders = () => fetchJSON('/orders');
export const createOrder = (order: any) => 
  fetchJSON('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });

export const updateOrderStatus = (orderId: number, status: string) => 
  fetchJSON(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });