'use client'

import React, { useState } from 'react'
import { Package, Clock, Calendar } from 'lucide-react'
import Header from "@/components/Header";

// Mock data - in a real app, this would come from an API or database
const initialProducts = {
  available: [
    { id: 1, name: 'Wireless Headphones' },
    { id: 2, name: 'Smart Watch' },
    { id: 3, name: 'Bluetooth Speaker' },
    { id: 4, name: 'USB-C Cable' },
  ],
  upcoming: [
    { id: 5, name: 'Gaming Laptop', arrivalDate: '2025-08-20' },
    { id: 6, name: 'Wireless Mouse', arrivalDate: '2025-08-25' },
    { id: 7, name: 'Mechanical Keyboard', arrivalDate: '2025-09-01' },
    { id: 8, name: '4K Monitor', arrivalDate: '2025-09-10' },
  ]
}

export default function ProductsPage() {
  const [products] = useState(initialProducts)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Header />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Available Products */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="text-green-600" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Available Products</h2>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                {products.available.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {products.available.map((product) => (
                <div key={product.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">{product.name}</span>
                </div>
              ))}
              {products.available.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No available products
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Products */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="text-orange-600" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Products</h2>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                {products.upcoming.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {products.upcoming.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar size={14} />
                    {formatDate(product.arrivalDate)}
                  </div>
                </div>
              ))}
              {products.upcoming.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No upcoming products
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}