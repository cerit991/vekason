<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAdminStore } from '../stores/admin'
import type { CustomerInfo } from '../types'

const cart = useCartStore()
const adminStore = useAdminStore()

const showOrderForm = ref(false)
const customerInfo = ref<CustomerInfo>({
  name: '',
  company: '',
  phone: '',
  notes: ''
})

function createOrder() {
  showOrderForm.value = true
}

async function submitOrder() {
  // Önce cart verilerini saklayalım
  const cartItems = [...cart.items];
  const cartTotal = cart.total;
  
  // WhatsApp onayını alalım
  const sendWhatsApp = confirm('Şu ürünleri WhatsApp üzerinden de talep olarak iletmek ister misiniz?\n\n' + 
    cartItems.map(item => `${item.product.name} - ${item.quantity} adet - ${item.product.price * item.quantity} TL`).join('\n') + 
    `\n\nToplam: ${cartTotal} TL`)

  // Siparişi admin store'a ekle
  adminStore.addOrder({
    items: cartItems,
    total: cartTotal,
    status: 'pending',
    createdAt: new Date().toISOString(),
    customerInfo: customerInfo.value
  })

  // Sepeti temizle ve formu kapat
  cart.clearCart()
  showOrderForm.value = false
  alert('Talebiniz başarıyla oluşturuldu! Admin onayından sonra sizinle iletişime geçilecektir.')

  // WhatsApp mesajı gönderme
  if (sendWhatsApp) {
    try {
      // Ürün listesi için daha okunabilir bir format oluşturalım
      const productList = cartItems.map(item => 
        `• ${item.product.name}\n` +
        `  Adet: ${item.quantity}\n` +
        `  Birim Fiyat: ${item.product.price} TL\n` +
        `  Toplam: ${item.product.price * item.quantity} TL\n` +
        `  Kategori: ${item.product.category}` +
        (item.product.brand ? `\n  Marka: ${item.product.brand}` : '') +
        (item.product.description ? `\n  Açıklama: ${item.product.description}` : '')
      ).join('\n\n')

      const message = 
`Merhaba, aşağıdaki ürünler için talebimi iletmek istiyorum:

----- ÜRÜN LİSTESİ -----
${productList}

----- ÖZET BİLGİLER -----
Toplam Tutar: ${cartTotal} TL

----- MÜŞTERİ BİLGİLERİ -----
İsim: ${customerInfo.value.name}
Firma: ${customerInfo.value.company}
Telefon: ${customerInfo.value.phone}
${customerInfo.value.notes ? `Açıklama: ${customerInfo.value.notes}` : ''}`

      // URL'yi oluştur ve encode et
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/905322969803?text=${encodedMessage}`
      
      // Yeni sekmede WhatsApp'ı aç
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
      }, 100)
    } catch (error) {
      console.error('WhatsApp yönlendirme hatası:', error)
      alert('WhatsApp yönlendirmesi sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-6">Alışveriş Sepeti</h2>
    
    <div v-if="cart.items.length === 0" class="text-center py-8">
      <p class="text-gray-500">Sepetiniz boş</p>
      <router-link
        to="/"
        class="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Alışverişe Başla
      </router-link>
    </div>
    
    <template v-else>
      <div class="space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.product.id"
          class="flex items-center justify-between border-b pb-4"
        >
          <div class="flex items-center space-x-4">
            <img
              :src="item.product.image"
              :alt="item.product.name"
              class="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 class="font-semibold">{{ item.product.name }}</h3>
              <p class="text-gray-600">{{ item.product.price }} TL</p>
              <p class="text-sm text-gray-500">
                Toplam: {{ item.product.price * item.quantity }} TL
              </p>
              <p class="text-sm text-gray-500">
                Kategori: {{ item.product.category }}
              </p>
              <p class="text-sm text-gray-500" v-if="item.product.brand">
                Marka: {{ item.product.brand }}
              </p>
              <p class="text-sm text-gray-500" v-if="item.product.description">
                Açıklama: {{ item.product.description }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center border rounded-lg overflow-hidden">
              <button 
                @click="item.quantity > 1 ? cart.updateQuantity(item.product.id, item.quantity - 1) : null"
                class="px-3 py-1 bg-gray-100 hover:bg-gray-200 border-r"
              >
                -
              </button>
              <input
                type="number"
                v-model="item.quantity"
                min="1"
                @change="cart.updateQuantity(item.product.id, item.quantity)"
                class="w-16 px-2 py-1 text-center focus:outline-none"
              />
              <button 
                @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                class="px-3 py-1 bg-gray-100 hover:bg-gray-200 border-l"
              >
                +
              </button>
            </div>
            <button
              @click="cart.removeFromCart(item.product.id)"
              class="text-red-500 hover:text-red-700"
            >
              Kaldır
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-6 text-right">
        <p class="text-xl font-bold">
          Toplam: {{ cart.total }} TL
        </p>
        <button
          v-if="!showOrderForm"
          @click="createOrder"
          class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Talep Oluştur
        </button>
      </div>

      <!-- Talep Formu -->
      <div v-if="showOrderForm" class="mt-8 border-t pt-6">
        <h3 class="text-xl font-semibold mb-4">Talep Bilgileri</h3>
        
        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              İsim Soyisim <span class="text-red-500">*</span>
            </label>
            <input
              v-model="customerInfo.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Firma
            </label>
            <input
              v-model="customerInfo.company"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Telefon <span class="text-red-500">*</span>
            </label>
            <input
              v-model="customerInfo.phone"
              type="tel"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <textarea
              v-model="customerInfo.notes"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Eklemek istediğiniz notlar..."
            ></textarea>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 class="font-medium mb-4">Talep Özeti</h4>
            <div class="space-y-4">
              <div
                v-for="item in cart.items"
                :key="item.product.id"
                class="flex justify-between items-start border-b pb-3"
              >
                <div class="flex space-x-4">
                  <img
                    :src="item.product.image"
                    :alt="item.product.name"
                    class="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h5 class="font-medium">{{ item.product.name }}</h5>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p>Kategori: {{ item.product.category }}</p>
                      <p v-if="item.product.brand">Marka: {{ item.product.brand }}</p>
                      <p>Birim Fiyat: {{ item.product.price }} TL</p>
                      <p>Miktar: {{ item.quantity }} adet</p>
                      <p v-if="item.product.description">Açıklama: {{ item.product.description }}</p>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <span class="font-medium">
                    {{ item.product.price * item.quantity }} TL
                  </span>
                </div>
              </div>
              <div class="border-t pt-3 font-bold flex justify-between">
                <span>Toplam</span>
                <span>{{ cart.total }} TL</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showOrderForm = false"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Talebi İlet
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>