<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <footer class="bg-white shadow-lg mt-12">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 AlışVeriş. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  </div>
</template>