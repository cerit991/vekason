<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useAdminStore } from '../../stores/admin'

const menuItems = [
  {
    name: 'Kategoriler',
    path: '/admin/categories',
    icon: `<path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" /><path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />`
  },
  {
    name: 'Markalar',
    path: '/admin/brands',
    icon: `<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />`
  },
  {
    name: 'Ürünler',
    path: '/admin/products',
    icon: `<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />`
  },
  {
    name: 'Talepler',
    path: '/admin/orders',
    icon: `<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />`
  }
]

const isSidebarOpen = ref(true)
const auth = useAuthStore()
const router = useRouter()
const adminStore = useAdminStore()

function handleLogout() {
  auth.logout()
  router.push('/admin/login')
}

// Admin paneli yüklendiğinde tüm verileri getir
onMounted(async () => {
  await Promise.all([
    adminStore.loadCategories(),
    adminStore.loadBrands(),
    adminStore.loadProducts(),
    adminStore.loadOrders()
  ])
})
</script>

<!-- Template kısmı aynı kalacak -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Bar -->
    <div class="bg-white shadow-sm border-b sticky top-0 z-40">
      <div class="flex items-center justify-between h-16 px-4">
        <div class="flex items-center">
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="ml-4 text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>
        <div class="flex items-center space-x-4">
          <router-link
            to="/"
            class="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Siteye Dön</span>
          </router-link>
          <button
            @click="handleLogout"
            class="text-red-600 hover:text-red-800 flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        :class="[
          'w-64 bg-white shadow-lg transition-all duration-300 transform',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
        ]"
        class="fixed left-0 h-[calc(100vh-4rem)] top-16 z-30"
      >
        <nav class="mt-4">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            :class="{ 'bg-blue-50 text-blue-600': $route.path === item.path }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" v-html="item.icon" />
            <span>{{ item.name }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main
        :class="[
          'flex-1 transition-all duration-300',
          isSidebarOpen ? 'ml-64' : 'ml-0'
        ]"
        class="p-6"
      >
        <RouterView />
      </main>
    </div>
  </div>
</template>