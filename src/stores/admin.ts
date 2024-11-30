import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, Category, Brand, Order } from '../types'
import * as api from '../api'

export const useAdminStore = defineStore('admin', () => {
  const categories = ref<Category[]>([])
  const brands = ref<Brand[]>([])
  const products = ref<Product[]>([])
  const orders = ref<Order[]>([])

  // Veri yükleme fonksiyonları
  async function loadCategories() {
    categories.value = await api.fetchCategories()
  }

  async function loadBrands() {
    brands.value = await api.fetchBrands()
  }

  async function loadProducts() {
    products.value = await api.fetchProducts()
  }

  async function loadOrders() {
    orders.value = await api.fetchOrders()
  }

  // Kategori işlemleri
  async function addCategory(category: Omit<Category, 'id'>) {
    const newCategory = await api.createCategory(category)
    categories.value.push(newCategory)
  }

  async function updateCategory(category: Category) {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value[index] = category
    }
  }

  function deleteCategory(id: number) {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  // Marka işlemleri
  async function addBrand(brand: Omit<Brand, 'id'>) {
    const newBrand = await api.createBrand(brand)
    brands.value.push(newBrand)
  }

  async function updateBrand(brand: Brand) {
    const index = brands.value.findIndex(b => b.id === brand.id)
    if (index !== -1) {
      brands.value[index] = brand
    }
  }

  function deleteBrand(id: number) {
    brands.value = brands.value.filter(b => b.id !== id)
  }

  // Ürün işlemleri
  async function addProduct(product: Omit<Product, 'id'>, imageFile?: File | null) {
    const newProduct = await api.createProduct(product, imageFile)
    products.value.push(newProduct)
  }

  async function updateProduct(product: Product, imageFile?: File | null) {
    const updatedProduct = await api.updateProduct(product, imageFile)
    const index = products.value.findIndex(p => p.id === product.id)
    if (index !== -1) {
      products.value[index] = updatedProduct
    }
  }

  async function deleteProduct(id: number) {
    try {
      await api.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Sipariş işlemleri
  async function addOrder(order: Omit<Order, 'id'>) {
    const newOrder = await api.createOrder(order)
    orders.value.push(newOrder)
  }

  async function updateOrderStatus(orderId: number, status: Order['status']) {
    const updatedOrder = await api.updateOrderStatus(orderId, status)
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = updatedOrder.status
    }
  }

  return {
    categories,
    brands,
    products,
    orders,
    loadCategories,
    loadBrands,
    loadProducts,
    loadOrders,
    addCategory,
    updateCategory,
    deleteCategory,
    addBrand,
    updateBrand,
    deleteBrand,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus
  }
})