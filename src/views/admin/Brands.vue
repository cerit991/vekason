<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { Brand } from '../../types'

const adminStore = useAdminStore()

const newBrand = ref({
  name: '',
  description: ''
})

const editingBrand = ref<Brand | null>(null)

function handleSubmit() {
  if (editingBrand.value) {
    adminStore.updateBrand({
      ...editingBrand.value,
      name: newBrand.value.name,
      description: newBrand.value.description
    })
    editingBrand.value = null
  } else {
    adminStore.addBrand(newBrand.value)
  }
  newBrand.value = { name: '', description: '' }
}

function startEdit(brand: Brand) {
  editingBrand.value = brand
  newBrand.value = {
    name: brand.name,
    description: brand.description
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-6">Marka Yönetimi</h2>
    
    <form @submit.prevent="handleSubmit" class="mb-8">
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Marka Adı</label>
          <input
            v-model="newBrand.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            v-model="newBrand.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {{ editingBrand ? 'Güncelle' : 'Ekle' }}
          </button>
        </div>
      </div>
    </form>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="brand in adminStore.brands"
        :key="brand.id"
        class="border rounded-lg p-4"
      >
        <div>
          <h3 class="text-lg font-semibold">{{ brand.name }}</h3>
          <p class="text-gray-600 mt-1">{{ brand.description }}</p>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="startEdit(brand)"
            class="text-blue-500 hover:text-blue-700"
          >
            Düzenle
          </button>
          <button
            @click="adminStore.deleteBrand(brand.id)"
            class="text-red-500 hover:text-red-700"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>