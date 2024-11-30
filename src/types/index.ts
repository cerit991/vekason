export interface Product {
  id: number
  name: string
  price: number
  category: string
  brand: string
  image: string
  description: string
}

export interface Category {
  id: number
  name: string
  description: string
}

export interface Brand {
  id: number
  name: string
  description: string
}

export interface OrderItem {
  product: Product
  quantity: number
}

export interface CustomerInfo {
  name: string
  company: string
  phone: string
  notes: string
}

export interface Order {
  id: number
  items: OrderItem[]
  total: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  customerInfo: CustomerInfo
}