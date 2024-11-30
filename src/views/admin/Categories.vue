<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { Category } from '../../types'

const adminStore = useAdminStore()

const newCategory = ref({
  name: '',
  description: ''
})

const editingCategory = ref<Category | null>(null)

function handleSubmit() {
  if (editingCategory.value) {
    adminStore.updateCategory({
      ...editingCategory.value,
      name: newCategory.value.name,
      description: newCategory.value.description
    })
    editingCategory.value = null
  } else {
    adminStore.addCategory(newCategory.value)
  }
  newCategory.value = { name: '', description: '' }
}

function startEdit(category: Category) {
  editingCategory.value = category
  newCategory.value = {
    name: category.name,
    description: category.description
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-6">Kategori Yönetimi</h2>
    
    <form @submit.prevent="handleSubmit" class="mb-8">
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Kategori Adı</label>
          <input
            v-model="newCategory.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            v-model="newCategory.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {{ editingCategory ? 'Güncelle' : 'Ekle' }}
          </button>
        </div>
      </div>
    </form>
    
    <div class="space-y-4">
      <div
        v-for="category in adminStore.categories"
        :key="category.id"
        class="flex items-center justify-between p-4 border rounded-lg"
      >
        <div>
          <h3 class="font-semibold">{{ category.name }}</h3>
          <p class="text-gray-600">{{ category.description }}</p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="startEdit(category)"
            class="text-blue-500 hover:text-blue-700"
          >
            Düzenle
          </button>
          <button
            @click="adminStore.deleteCategory(category.id)"
            class="text-red-500 hover:text-red-700"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>