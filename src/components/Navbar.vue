<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { computed } from 'vue'

const cart = useCartStore()
const itemCount = computed(() => {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
})
</script>

<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <router-link 
            to="/" 
            class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            Veka Ticaret
          </router-link>
        </div>
        <div class="flex items-center space-x-6">
          <router-link 
            to="/cart" 
            class="relative group"
          >
            <div class="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span 
                v-if="itemCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
              >
                {{ itemCount }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>