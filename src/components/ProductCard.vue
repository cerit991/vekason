<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '../types'
import { useCartStore } from '../stores/cart'

defineProps<{
  product: Product
}>()

const cart = useCartStore()
const quantity = ref(1)
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
    <div class="relative">
      <img 
        :src="product.image" 
        :alt="product.name" 
        class="w-full h-48 object-cover"
      />
      <div class="absolute top-2 right-2">
        <span class="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {{ product.price }} TL
        </span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          {{ product.category }}
        </div>
        <div v-if="product.brand" class="flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
          {{ product.brand }}
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="flex items-center border rounded-lg overflow-hidden bg-gray-50">
          <button 
            @click="quantity > 1 ? quantity-- : null"
            class="px-3 py-1 hover:bg-gray-100 border-r"
          >
            -
          </button>
          <input
            type="number"
            v-model="quantity"
            min="1"
            class="w-14 px-2 py-1 text-center bg-transparent focus:outline-none"
          />
          <button 
            @click="quantity++"
            class="px-3 py-1 hover:bg-gray-100 border-l"
          >
            +
          </button>
        </div>
        <button
          @click="cart.addToCart(product, quantity)"
          class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>Sepete Ekle</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProductCard'
}
</script>