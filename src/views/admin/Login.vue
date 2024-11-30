<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const password = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

function handleLogin() {
  if (auth.login(password.value)) {
    router.push('/admin/products')
  } else {
    error.value = 'Şifre yanlış!'
    password.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Admin Girişi</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Şifre</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        
        <button
          type="submit"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  </div>
</template>