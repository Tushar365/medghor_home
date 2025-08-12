'use client'
import Header from "@/components/Header";

import React, { useState, useCallback } from 'react'
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react'

interface Product {
  id: number
  name: string
}

interface UpcomingProduct extends Product {
  arrivalDate: string
}

interface ProductsState {
  available: Product[]
  upcoming: UpcomingProduct[]
}

interface NewProduct {
  name: string
  type: 'available' | 'upcoming'
  arrivalDate: string
}

interface EditingProduct extends Product {
  type: 'available' | 'upcoming'
  arrivalDate?: string
}

// Mock data - in a real app, this would come from an API or database
const initialProducts: ProductsState = {
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

export default function OfficePage() {
  const [products, setProducts] = useState<ProductsState>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null)
  const [newProduct, setNewProduct] = useState<NewProduct>({ 
    name: '', 
    type: 'available', 
    arrivalDate: '' 
  })
  const [error, setError] = useState<string>('')

  const formatDate = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }, [])

  const validateProduct = useCallback((name: string, type: string, arrivalDate: string): string => {
    if (!name.trim()) {
      return 'Product name is required'
    }
    if (name.trim().length < 2) {
      return 'Product name must be at least 2 characters'
    }
    if (type === 'upcoming' && !arrivalDate) {
      return 'Arrival date is required for upcoming products'
    }
    if (type === 'upcoming' && arrivalDate && new Date(arrivalDate) < new Date()) {
      return 'Arrival date must be in the future'
    }
    return ''
  }, [])

  const handleAddProduct = useCallback(() => {
    setError('')
    
    const validationError = validateProduct(newProduct.name, newProduct.type, newProduct.arrivalDate)
    if (validationError) {
      setError(validationError)
      return
    }

    const product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      ...(newProduct.type === 'upcoming' && { arrivalDate: newProduct.arrivalDate })
    }

    setProducts(prev => ({
      ...prev,
      [newProduct.type]: [...prev[newProduct.type], product]
    }))

    setNewProduct({ name: '', type: 'available', arrivalDate: '' })
  }, [newProduct, validateProduct])

  const handleEditProduct = useCallback((product: Product | UpcomingProduct, type: 'available' | 'upcoming') => {
    setError('')
    setEditingProduct({ 
      ...product, 
      type,
      arrivalDate: 'arrivalDate' in product ? product.arrivalDate : ''
    })
  }, [])

  const handleUpdateProduct = useCallback(() => {
    if (!editingProduct) return
    
    setError('')
    
    const validationError = validateProduct(
      editingProduct.name, 
      editingProduct.type, 
      editingProduct.arrivalDate || ''
    )
    if (validationError) {
      setError(validationError)
      return
    }

    setProducts(prev => ({
      ...prev,
      [editingProduct.type]: prev[editingProduct.type].map(p =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editingProduct.name.trim(),
              ...(editingProduct.type === 'upcoming' && { arrivalDate: editingProduct.arrivalDate || '' })
            }
          : p
      )
    }))

    setEditingProduct(null)
  }, [editingProduct, validateProduct])

  const handleDeleteProduct = useCallback((id: number, type: 'available' | 'upcoming') => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => ({
        ...prev,
        [type]: prev[type].filter(p => p.id !== id)
      }))
    }
  }, [])

  const handleKeyPress = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }, [])

  const closeModal = useCallback(() => {
    setEditingProduct(null)
    setError('')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Header />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Office - Product Management</h1>
          <p className="text-gray-600">Add, edit, and remove products from your inventory</p>
        </div>
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError('')} 
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Add New Product */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-green-600" />
            Add New Product
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => {
                setNewProduct(prev => ({ ...prev, name: e.target.value }))
                setError('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyPress={(e) => handleKeyPress(e, handleAddProduct)}
            />
            <select
              value={newProduct.type}
              onChange={(e) => setNewProduct(prev => ({ 
                ...prev, 
                type: e.target.value as 'available' | 'upcoming',
                arrivalDate: e.target.value === 'available' ? '' : prev.arrivalDate
              }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="available">Available</option>
              <option value="upcoming">Upcoming</option>
            </select>
            {newProduct.type === 'upcoming' && (
              <input
                type="date"
                value={newProduct.arrivalDate}
                onChange={(e) => {
                  setNewProduct(prev => ({ ...prev, arrivalDate: e.target.value }))
                  setError('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            )}
            <button
              onClick={handleAddProduct}
              disabled={!newProduct.name.trim() || (newProduct.type === 'upcoming' && !newProduct.arrivalDate)}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Available Products Management */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-700">
              Available Products ({products.available.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.available.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-gray-800 truncate">{product.name}</span>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditProduct(product, 'available')}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                      title="Edit product"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, 'available')}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                      title="Delete product"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {products.available.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>No available products</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Products Management */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">
              Upcoming Products ({products.upcoming.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.upcoming.map((product) => (
                <div key={product.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="font-medium text-gray-800 truncate">{product.name}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditProduct(product, 'upcoming')}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, 'upcoming')}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 ml-5">
                    Expected: {formatDate(product.arrivalDate)}
                  </div>
                </div>
              ))}
              {products.upcoming.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>No upcoming products</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingProduct && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Edit2 size={20} className="text-blue-600" />
                Edit Product
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={editingProduct.name}
                    onChange={(e) => {
                      setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)
                      setError('')
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    onKeyPress={(e) => handleKeyPress(e, handleUpdateProduct)}
                    autoFocus
                  />
                </div>
                {editingProduct.type === 'upcoming' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Arrival Date
                    </label>
                    <input
                      type="date"
                      value={editingProduct.arrivalDate || ''}
                      onChange={(e) => {
                        setEditingProduct(prev => prev ? { ...prev, arrivalDate: e.target.value } : null)
                        setError('')
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProduct}
                    disabled={
                      !editingProduct.name.trim() || 
                      (editingProduct.type === 'upcoming' && !editingProduct.arrivalDate)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Update
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}