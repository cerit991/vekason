<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
const selectedCategory = ref('')
const searchQuery = ref('')
const showProducts = ref(false)
const currentImageIndex = ref(0)

// Slider görselleri
const sliderImages = [
  {
    url: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 1"
  },
  {
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 2"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 3"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 4"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 5"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 6"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 7"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 8"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 9"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    alt: "Background 10"
  }
]

// Timer için referans
let sliderTimer: ReturnType<typeof setInterval> | null = null

// Slider fonksiyonu
const startSlider = () => {
  sliderTimer = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % sliderImages.length
  }, 5000)
}

// Component unmount olduğunda timer'ı temizle
onUnmounted(() => {
  if (sliderTimer) clearInterval(sliderTimer)
})

const categories = computed(() => {
  return ['', ...new Set(adminStore.products.map(p => p.category))]
})

const filteredProducts = computed(() => {
  let products = adminStore.products

  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }

  return products
})

const features = [
  {
    title: 'Geniş Ürün Yelpazesi',
    description: 'Elektronikten giyime, birçok kategoride kaliteli ürünler',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />`
  },
  {
    title: 'Hızlı Teslimat',
    description: 'Siparişleriniz en kısa sürede elinizde',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />`
  },
  {
    title: 'Müşteri Memnuniyeti',
    description: '7/24 müşteri desteği ve kolay iade imkanı',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />`
  }
]

const scrollToProducts = () => {
  const productsSection = document.getElementById('products-section')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

async function loadProducts() {
  if (!showProducts.value) {
    showProducts.value = true
    await adminStore.loadProducts()
    scrollToProducts()
  }
}

onMounted(async () => {
  await adminStore.loadProducts()
  startSlider() // Slider'ı başlat
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <transition name="fade" mode="out-in">
          <img 
            :key="currentImageIndex"
            :src="sliderImages[currentImageIndex].url"
            :alt="sliderImages[currentImageIndex].alt"
            class="w-full h-full object-cover"
          />
        </transition>
      </div>
      <div class="relative pt-24 pb-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto">
            <h1 class="text-5xl font-bold tracking-tight mb-6">
              Kaliteli Ürünler
              <span class="block text-indigo-200">Uygun Fiyatlar</span>
            </h1>
            <p class="text-xl text-indigo-100 mb-8">
              "20 yıllık tecrübemizle, endüstriyel ve perakende ambalaj çözümlerinde lider konumdayız. Yenilikçi tasarımlarımız, çevre dostu malzemelerimiz ve zamanında teslimat garantimizle işletmenizin ihtiyaçlarını karşılıyoruz. Özelleştirilebilir çözümlerimiz ve rekabetçi fiyatlarımızla sizlere değer katmaya hazırız. Ücretsiz danışmanlık için bize ulaşın."
            </p>
            <button
              @click="loadProducts"
              class="inline-flex items-center px-8 py-3 rounded-full bg-white text-blue-600 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              <span>Ürünleri Keşfet</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p class="text-xl text-gray-500">
            Size en iyi hizmeti sunmak için çalışıyoruz
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="text-center"
          >
            <div class="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-6">
              <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" v-html="feature.icon"></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-gray-500">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div id="products-section" v-if="showProducts" class="bg-gray-50 py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div v-if="adminStore.products.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Henüz ürün bulunmuyor.</p>
        </div>
        
        <template v-else>
          <!-- Filters -->
          <div class="mb-8 bg-white rounded-xl shadow-md p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Ürün ara..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <select
                v-model="selectedCategory"
                class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Kategoriler</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="bg-white py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            İletişime Geçin
          </h2>
          <p class="text-xl text-gray-500 mb-12">
            Sorularınız için bize ulaşın
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <h3 class="font-semibold mb-2">Adres</h3>
              <p class="text-gray-600">Side, 07330 Manavgat/Antalya</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <h3 class="font-semibold mb-2">Telefon</h3>
              <p class="text-gray-600">
                <a href="tel:05322969803" class="text-blue-600 hover:underline">+90 532 296 98 03</a>
              </p>
              <p class="text-gray-600">
                <a href="tel:05324752707" class="text-blue-600 hover:underline">+90 532 475 27 07</a>
              </p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <h3 class="font-semibold mb-2">E-posta</h3>
              <p class="text-gray-600">info@vekaticaret.com</p>
            </div>
          </div>
          <iframe
            class="mt-12 w-full h-64 rounded-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3171.838947639504!2d31.3936113153181!3d36.76694797995756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c359fd874211b9%3A0xa0ad518ce0d2bfe1!2sSide%2C%20Veka%20Manavgat%20-%20Profesyonel%20T%C3%BCketim%20%C3%9Cr%C3%BCnleri%20-%20Temizlik%20-%20Ambalaj%20-%20Hijyen%2C%2007330%20Manavgat%2FAntalya!5e0!3m2!1sen!2str!4v1634567890123!5m2!1sen!2str"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>