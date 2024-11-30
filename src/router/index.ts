import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import AdminLogin from '../views/admin/Login.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminCategories from '../views/admin/Categories.vue'
import AdminBrands from '../views/admin/Brands.vue'
import AdminProducts from '../views/admin/Products.vue'
import AdminOrders from '../views/admin/Orders.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'categories',
          name: 'admin-categories',
          component: AdminCategories
        },
        {
          path: 'brands',
          name: 'admin-brands',
          component: AdminBrands
        },
        {
          path: 'products',
          name: 'admin-products',
          component: AdminProducts
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: AdminOrders
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router