'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id, Doc } from '@/convex/_generated/dataModel';
import { Plus, Edit2, Trash2, Calendar, Package } from 'lucide-react';

export default function OfficePage() {
  // State for modals and forms
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUpcoming, setShowAddUpcoming] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Doc<"products"> | null>(null);
  const [editingUpcoming, setEditingUpcoming] = useState<Doc<"upcomingProducts"> | null>(null);

  // Form states
  const [productName, setProductName] = useState('');
  const [upcomingName, setUpcomingName] = useState('');
  const [expectedDate, setExpectedDate] = useState('');

  // Queries
  const products = useQuery(api.inventory.listProducts) || [];
  const upcomingProducts = useQuery(api.inventory.listUpcomingProducts) || [];

  // Mutations
  const addProduct = useMutation(api.inventory.addProduct);
  const editProduct = useMutation(api.inventory.editProduct);
  const removeProduct = useMutation(api.inventory.removeProduct);
  const addUpcomingProduct = useMutation(api.inventory.addUpcomingProduct);
  const editUpcomingProduct = useMutation(api.inventory.editUpcomingProduct);
  const removeUpcomingProduct = useMutation(api.inventory.removeUpcomingProduct);

  // Handlers for products
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    
    try {
      await addProduct({ name: productName.trim() });
      setProductName('');
      setShowAddProduct(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !editingProduct) return;
    
    try {
      await editProduct({ id: editingProduct._id, name: productName.trim() });
      setProductName('');
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to edit product:', error);
    }
  };

  const handleDeleteProduct = async (id: Id<"products">) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await removeProduct({ id });
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  // Handlers for upcoming products
  const handleAddUpcoming = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upcomingName.trim() || !expectedDate) return;
    
    try {
      await addUpcomingProduct({ 
        name: upcomingName.trim(), 
        expectedDate: new Date(expectedDate).getTime() 
      });
      setUpcomingName('');
      setExpectedDate('');
      setShowAddUpcoming(false);
    } catch (error) {
      console.error('Failed to add upcoming product:', error);
    }
  };

  const handleEditUpcoming = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upcomingName.trim() || !expectedDate || !editingUpcoming) return;
    
    try {
      await editUpcomingProduct({ 
        id: editingUpcoming._id, 
        name: upcomingName.trim(), 
        expectedDate: new Date(expectedDate).getTime() 
      });
      setUpcomingName('');
      setExpectedDate('');
      setEditingUpcoming(null);
    } catch (error) {
      console.error('Failed to edit upcoming product:', error);
    }
  };

  const handleDeleteUpcoming = async (id: Id<"upcomingProducts">) => {
    if (window.confirm('Are you sure you want to delete this upcoming product?')) {
      try {
        await removeUpcomingProduct({ id });
      } catch (error) {
        console.error('Failed to delete upcoming product:', error);
      }
    }
  };

  // Helper functions
  const startEditingProduct = (product: Doc<"products">) => {
    setEditingProduct(product);
    setProductName(product.name);
  };

  const startEditingUpcoming = (product: Doc<"upcomingProducts">) => {
    setEditingUpcoming(product);
    setUpcomingName(product.name);
    setExpectedDate(new Date(product.expectedDate).toISOString().split('T')[0]);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditingUpcoming(null);
    setProductName('');
    setUpcomingName('');
    setExpectedDate('');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Management Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Current Products</h2>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="space-y-3">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products found</p>
              ) : (
                products.map((product: Doc<"products">) => (
                  <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">Added: {formatDate(product._creationTime)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditingProduct(product)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id as Id<"products">)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Products</h2>
              </div>
              <button
                onClick={() => setShowAddUpcoming(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Upcoming</span>
              </button>
            </div>

            <div className="space-y-3">
              {upcomingProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming products found</p>
              ) : (
                upcomingProducts.map((product: Doc<"upcomingProducts">) => (
                  <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">Expected: {formatDate(product.expectedDate)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditingUpcoming(product)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUpcoming(product._id as Id<"upcomingProducts">)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false);
                      setProductName('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Upcoming Product Modal */}
        {showAddUpcoming && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add Upcoming Product</h3>
              <form onSubmit={handleAddUpcoming}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={upcomingName}
                    onChange={(e) => setUpcomingName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUpcoming(false);
                      setUpcomingName('');
                      setExpectedDate('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
              <form onSubmit={handleEditProduct}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Upcoming Product Modal */}
        {editingUpcoming && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Upcoming Product</h3>
              <form onSubmit={handleEditUpcoming}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={upcomingName}
                    onChange={(e) => setUpcomingName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}