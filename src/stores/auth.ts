import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const password = 'admin123' // Gerçek uygulamada bu şifre backend'de güvenli bir şekilde saklanmalıdır

  function login(inputPassword: string) {
    if (inputPassword === password) {
      isAuthenticated.value = true
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    login,
    logout
  }
})