'use client';
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Package, Calendar, Clipboard } from 'lucide-react';

const MedghorAnnounceBoard = () => {
  const products = useQuery(api.inventory.listProducts);
  const upcomingProducts = useQuery(api.inventory.listUpcomingProducts);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const isLoading = products === undefined || upcomingProducts === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-pulse text-4xl sm:text-6xl mb-4">📋</div>
          <p className="text-amber-800 text-lg sm:text-xl font-serif">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        
        {/* Header Board */}
        <div className="bg-amber-100 border-4 sm:border-8 border-amber-800 rounded-lg shadow-lg mb-4 sm:mb-8 p-4 sm:p-8 text-center relative">
          <div className="absolute top-2 left-2 sm:left-4 w-2 sm:w-3 h-2 sm:h-3 bg-red-600 rounded-full shadow-md"></div>
          <div className="absolute top-2 right-2 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 bg-red-600 rounded-full shadow-md"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-red-600 rounded-full shadow-md"></div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-amber-900 font-serif mb-2 tracking-wide leading-tight">
            MEDGHOR DISTRIBUTORS
          </h1>
          <div className="w-16 sm:w-32 h-0.5 sm:h-1 bg-amber-800 mx-auto mb-2 sm:mb-4"></div>
          <h2 className="text-sm sm:text-lg md:text-2xl text-amber-800 font-serif italic">
            ★ OFFICIAL ANNOUNCEMENT BOARD ★
          </h2>
          <p className="text-amber-700 mt-2 sm:mt-4 font-serif text-xs sm:text-base md:text-lg">
            Current Date: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Statistics Board */}
        <div className="bg-white border-2 sm:border-4 border-amber-700 rounded-lg shadow-lg mb-4 sm:mb-8 p-3 sm:p-6 relative">
          <div className="absolute -top-2 sm:-top-3 left-3 sm:left-6 bg-amber-700 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-bold">
            INVENTORY SUMMARY
          </div>
          <div className="pt-3 sm:pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center">
              <div className="border-2 border-dashed border-amber-300 p-3 sm:p-4 rounded">
                <Package className="h-6 sm:h-8 w-6 sm:w-8 text-amber-700 mx-auto mb-1 sm:mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-amber-900 font-serif">
                  {products?.length || 0}
                </div>
                <div className="text-amber-700 font-serif text-sm sm:text-lg">Current Stock</div>
              </div>
              <div className="border-2 border-dashed border-amber-300 p-3 sm:p-4 rounded">
                <Calendar className="h-6 sm:h-8 w-6 sm:w-8 text-amber-700 mx-auto mb-1 sm:mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-amber-900 font-serif">
                  {upcomingProducts?.length || 0}
                </div>
                <div className="text-amber-700 font-serif text-sm sm:text-lg">Incoming Items</div>
              </div>
              <div className="border-2 border-dashed border-amber-300 p-3 sm:p-4 rounded">
                <Clipboard className="h-6 sm:h-8 w-6 sm:w-8 text-amber-700 mx-auto mb-1 sm:mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-amber-900 font-serif">
                  {(products?.length || 0) + (upcomingProducts?.length || 0)}
                </div>
                <div className="text-amber-700 font-serif text-sm sm:text-lg">Total Items</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          
          {/* Current Products Notice */}
          <div className="bg-green-50 border-2 sm:border-4 border-green-700 rounded-lg shadow-lg relative">
            <div className="absolute -top-2 sm:-top-3 left-3 sm:left-6 bg-green-700 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-bold">
              ★ AVAILABLE NOW ★
            </div>
            <div className="p-3 sm:p-6 pt-4 sm:pt-8">
              <div className="text-center mb-4 sm:mb-6">
                <Package className="h-8 sm:h-12 w-8 sm:w-12 text-green-700 mx-auto mb-1 sm:mb-2" />
                <h3 className="text-lg sm:text-2xl font-bold text-green-800 font-serif">CURRENT INVENTORY</h3>
                <div className="w-12 sm:w-16 h-0.5 bg-green-700 mx-auto mt-1 sm:mt-2"></div>
              </div>
              
              {products && products.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {products.map((product, index) => (
                    <div key={product._id} className="bg-white border-2 border-green-200 rounded p-3 sm:p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex-1">
                          <div className="font-bold text-green-900 text-sm sm:text-lg font-serif break-words">
                            {index + 1}. {product.name.toUpperCase()}
                          </div>
                          <div className="text-green-700 text-xs sm:text-sm font-serif">
                            Stocked: {formatDate(product._creationTime)}
                          </div>
                        </div>
                        <div className="bg-green-100 border border-green-300 px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                          <span className="text-green-800 font-bold text-xs sm:text-sm">IN STOCK</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 border-2 border-dashed border-green-300 rounded bg-white">
                  <Package className="h-12 sm:h-16 w-12 sm:w-16 text-green-400 mx-auto mb-2 sm:mb-3" />
                  <h4 className="text-lg sm:text-xl font-bold text-green-800 font-serif mb-1 sm:mb-2">NO CURRENT STOCK</h4>
                  <p className="text-green-600 font-serif text-sm sm:text-base">
                    New arrivals will be posted here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Products Notice */}
          <div className="bg-orange-50 border-2 sm:border-4 border-orange-700 rounded-lg shadow-lg relative">
            <div className="absolute -top-2 sm:-top-3 left-3 sm:left-6 bg-orange-700 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-bold">
              ★ COMING SOON ★
            </div>
            <div className="p-3 sm:p-6 pt-4 sm:pt-8">
              <div className="text-center mb-4 sm:mb-6">
                <Calendar className="h-8 sm:h-12 w-8 sm:w-12 text-orange-700 mx-auto mb-1 sm:mb-2" />
                <h3 className="text-lg sm:text-2xl font-bold text-orange-800 font-serif">EXPECTED ARRIVALS</h3>
                <div className="w-12 sm:w-16 h-0.5 bg-orange-700 mx-auto mt-1 sm:mt-2"></div>
              </div>
              
              {upcomingProducts && upcomingProducts.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {upcomingProducts
                    .sort((a, b) => a.expectedDate - b.expectedDate)
                    .map((product, index) => (
                    <div key={product._id} className="bg-white border-2 border-orange-200 rounded p-3 sm:p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex-1">
                          <div className="font-bold text-orange-900 text-sm sm:text-lg font-serif break-words">
                            {index + 1}. {product.name.toUpperCase()}
                          </div>
                          <div className="text-orange-700 text-xs sm:text-sm font-serif">
                            Expected: {formatDate(product.expectedDate)}
                          </div>
                        </div>
                        <div className="bg-orange-100 border border-orange-300 px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                          <span className="text-orange-800 font-bold text-xs sm:text-sm">PENDING</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 border-2 border-dashed border-orange-300 rounded bg-white">
                  <Calendar className="h-12 sm:h-16 w-12 sm:w-16 text-orange-400 mx-auto mb-2 sm:mb-3" />
                  <h4 className="text-lg sm:text-xl font-bold text-orange-800 font-serif mb-1 sm:mb-2">NO SCHEDULED ARRIVALS</h4>
                  <p className="text-orange-600 font-serif text-sm sm:text-base">
                    Future shipments will be announced here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="bg-amber-100 border-2 sm:border-4 border-amber-800 rounded-lg shadow-lg mt-4 sm:mt-8 p-3 sm:p-6 text-center">
          <p className="text-amber-800 font-serif text-sm sm:text-lg font-bold mb-2 sm:mb-4">
            FOR INQUIRIES CONTACT MEDGHOR DISTRIBUTORS MANAGEMENT
          </p>
          <div className="space-y-1 sm:space-y-2 text-amber-800 font-serif text-xs sm:text-base">
            <p className="break-words">
              <span className="font-bold">Phone:</span> +1 (123) 456-7890, +1 (987) 654-3210
            </p>
            <p className="break-words">
              <span className="font-bold">WhatsApp:</span>{' '}
              <a 
                href="https://wa.me/11234567890" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-700 hover:underline break-words"
              >
                +1 (123) 456-7890
              </a>
            </p>
            <p className="break-words">
              <span className="font-bold">Email:</span>{' '}
              <a 
                href="mailto:info@medghordistributors.com" 
                className="text-blue-700 hover:underline break-words"
              >
                info@medghordistributors.com
              </a>
            </p>
            <p className="break-words">
              <span className="font-bold">Address:</span> 123 Distribution Lane, Business City, BC 12345
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center mt-2 sm:mt-4 gap-1 sm:gap-4 text-amber-700 font-serif text-xs sm:text-base">
            <span>★</span>
            <span>ESTABLISHED DISTRIBUTOR</span>
            <span>★</span>
            <span className="hidden sm:inline">RELIABLE SERVICE</span>
            <span className="sm:hidden">RELIABLE</span>
            <span>★</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedghorAnnounceBoard;