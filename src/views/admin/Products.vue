<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { Product } from '../../types'

const adminStore = useAdminStore()

const newProduct = ref({
  name: '',
  price: 0,
  category: '',
  brand: '',
  image: '',
  description: ''
})

const editingProduct = ref<Product | null>(null)
const previewImage = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleImageSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

async function handleSubmit() {
  if (!newProduct.value.category) {
    alert('Kategori seçimi zorunludur!')
    return
  }

  if (!selectedFile.value && !editingProduct.value) {
    alert('Lütfen bir resim seçin!')
    return
  }

  try {
    if (editingProduct.value) {
      await adminStore.updateProduct({
        ...editingProduct.value,
        ...newProduct.value
      }, selectedFile.value)
      editingProduct.value = null
    } else {
      await adminStore.addProduct(newProduct.value, selectedFile.value)
    }
    resetForm()
  } catch (error) {
    console.error('Error submitting product:', error)
    alert('Ürün kaydedilirken bir hata oluştu.')
  }
}

function resetForm() {
  newProduct.value = {
    name: '',
    price: 0,
    category: '',
    brand: '',
    image: '',
    description: ''
  }
  previewImage.value = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function startEdit(product: Product) {
  editingProduct.value = product
  newProduct.value = {
    name: product.name,
    price: product.price,
    category: product.category,
    brand: product.brand,
    image: product.image,
    description: product.description
  }
  previewImage.value = product.image
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-6">Ürün Yönetimi</h2>
    
    <form @submit.prevent="handleSubmit" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Ürün Adı</label>
          <input
            v-model="newProduct.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fiyat</label>
          <input
            v-model.number="newProduct.price"
            type="number"
            required
            min="0"
            step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Kategori <span class="text-red-500">*</span>
          </label>
          <select
            v-model="newProduct.category"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Kategori Seçin</option>
            <option
              v-for="category in adminStore.categories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Marka</label>
          <select
            v-model="newProduct.brand"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Marka Seçin (Opsiyonel)</option>
            <option
              v-for="brand in adminStore.brands"
              :key="brand.id"
              :value="brand.name"
            >
              {{ brand.name }}
            </option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">
            Ürün Resmi <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 flex items-center space-x-4">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageSelect"
              class="hidden"
            />
            <button
              type="button"
              @click="fileInput?.click()"
              class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Resim Seç
            </button>
            <div v-if="previewImage" class="relative w-24 h-24">
              <img
                :src="previewImage"
                class="w-full h-full object-cover rounded"
                alt="Preview"
              />
              <button
                type="button"
                @click="previewImage = ''; selectedFile = null; if (fileInput) fileInput.value = ''"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            v-model="newProduct.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <div class="md:col-span-2">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {{ editingProduct ? 'Güncelle' : 'Ekle' }}
          </button>
        </div>
      </div>
    </form>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in adminStore.products"
        :key="product.id"
        class="border rounded-lg p-4"
      >
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="w-full h-48 object-cover rounded mb-4"
        />
        <div v-else class="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
          Resim Yok
        </div>
        <div>
          <h3 class="font-semibold">{{ product.name }}</h3>
          <p class="text-gray-600">{{ product.description }}</p>
          <div class="mt-2">
            <span class="font-bold">{{ product.price }} TL</span>
            <div class="text-gray-500 mt-1">
              <div>Kategori: {{ product.category }}</div>
              <div v-if="product.brand">Marka: {{ product.brand }}</div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="startEdit(product)"
            class="text-blue-500 hover:text-blue-700"
          >
            Düzenle
          </button>
          <button
            @click="adminStore.deleteProduct(product.id)"
            class="text-red-500 hover:text-red-700"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>