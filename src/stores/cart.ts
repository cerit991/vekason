import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '../types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<{ product: Product; quantity: number }[]>([])

  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)
  })

  function addToCart(product: Product, quantity: number = 1) {
    const existingItem = items.value.find(item => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
  }

  function removeFromCart(productId: number) {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.product.id === productId)
    if (item && quantity > 0) {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  return { items, total, addToCart, removeFromCart, updateQuantity, clearCart }
})