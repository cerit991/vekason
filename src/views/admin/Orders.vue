<script setup lang="ts">
import { useAdminStore } from '../../stores/admin'
import { computed, onMounted, ref } from 'vue'

const adminStore = useAdminStore()
const expandedOrders = ref(new Set<number>())

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
}

const statusText = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi'
}

const sortedOrders = computed(() => {
  return [...adminStore.orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('tr-TR')
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price)
}

function toggleOrder(orderId: number) {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId)
  } else {
    expandedOrders.value.add(orderId)
  }
}

onMounted(async () => {
  await adminStore.loadOrders()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Talep Yönetimi</h2>
      <button
        @click="adminStore.loadOrders()"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Talepleri Yenile
      </button>
    </div>
    
    <div v-if="adminStore.orders.length === 0" class="text-center py-8 text-gray-500">
      Henüz talep bulunmuyor
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="order in sortedOrders"
        :key="order.id"
        class="border rounded-lg overflow-hidden"
      >
        <!-- Talep Başlığı - Her zaman görünür -->
        <div
          @click="toggleOrder(order.id)"
          class="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-gray-500 transform transition-transform"
                :class="{ 'rotate-90': expandedOrders.has(order.id) }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium">Talep #{{ order.id }}</span>
            </div>
            <div class="text-sm text-gray-600">
              <span>{{ order.customerInfo.name }}</span>
              <template v-if="order.customerInfo.company">
                <span> - {{ order.customerInfo.company }}</span>
              </template>
              <span class="mx-2">|</span>
              <span class="font-medium text-blue-600">{{ formatPrice(order.total) }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</span>
            <span
              :class="[
                'px-2 py-1 rounded-full text-sm',
                statusColors[order.status]
              ]"
            >
              {{ statusText[order.status] }}
            </span>
          </div>
        </div>

        <!-- Talep Detayları - Açıldığında görünür -->
        <div
          v-if="expandedOrders.has(order.id)"
          class="p-4 border-t"
        >
          <!-- Müşteri Bilgileri -->
          <div class="mb-4 bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">Müşteri Bilgileri</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="font-medium">İsim:</span> {{ order.customerInfo.name }}
              </div>
              <div v-if="order.customerInfo.company">
                <span class="font-medium">Firma:</span> {{ order.customerInfo.company }}
              </div>
              <div>
                <span class="font-medium">Telefon:</span> {{ order.customerInfo.phone }}
              </div>
            </div>
            <div v-if="order.customerInfo.notes" class="mt-2 text-sm">
              <span class="font-medium">Not:</span>
              <p class="mt-1 text-gray-600">{{ order.customerInfo.notes }}</p>
            </div>
          </div>

          <!-- Ürünler -->
          <div class="space-y-3">
            <div
              v-for="item in order.items"
              :key="item.product.id"
              class="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg"
            >
              <img
                :src="item.product.image"
                :alt="item.product.name"
                class="w-16 h-16 object-cover rounded"
              />
              <div class="flex-1">
                <h4 class="font-medium">{{ item.product.name }}</h4>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>
                    <span class="font-medium">Kategori:</span> 
                    {{ item.product.category }}
                  </p>
                  <p v-if="item.product.brand">
                    <span class="font-medium">Marka:</span> 
                    {{ item.product.brand }}
                  </p>
                  <p class="text-blue-600 font-medium">
                    {{ item.quantity }} adet × {{ formatPrice(item.product.price) }} = 
                    {{ formatPrice(item.quantity * item.product.price) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Toplam ve Aksiyonlar -->
          <div class="mt-4 flex justify-between items-center">
            <div v-if="order.status === 'pending'" class="flex space-x-2">
              <button
                @click="adminStore.updateOrderStatus(order.id, 'approved')"
                class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Onayla
              </button>
              <button
                @click="adminStore.updateOrderStatus(order.id, 'rejected')"
                class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reddet
              </button>
            </div>
            <p class="font-bold text-lg">
              Toplam: {{ formatPrice(order.total) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>