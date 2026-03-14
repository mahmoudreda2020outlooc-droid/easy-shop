'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutModal from '@/components/CheckoutModal';

const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxooB4SU0-JBXd-0EBAhp6jonWidCuf0t5QNGqWkLVHzZth2VpdUk7fZ5nIPXl2XGu5lg/exec';

const sampleProducts: any[] = [];

export default function Home() {
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(SHEETS_API_URL);
        const data = await response.json();
        if (Array.isArray(data)) {
          setDynamicProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to localStorage if any
        const saved = localStorage.getItem('easy_shop_products');
        if (saved) {
          setDynamicProducts(JSON.parse(saved));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const allProducts = [...sampleProducts, ...dynamicProducts];

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <main className="bg-[#111111] min-h-screen selection:bg-[#a855f7] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#a855f7]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#eab308]/5 rounded-full blur-[150px] animate-pulse delay-700" />

        <div className="w-full max-w-[1400px] flex flex-col items-center justify-center z-10 text-center space-y-12">
          <div className="flex flex-col items-center max-w-4xl space-y-8">
            <h1 className="text-7xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase italic select-none">
              <span className="text-[#eab308] text-glow-gold">Easy</span>
              <br />
              <span className="text-[#a855f7] text-glow-purple ml-12 lg:ml-24">Shop</span>
            </h1>
            <p className="text-[#888888] text-xl lg:text-2xl max-w-2xl mx-auto font-light tracking-wide">
              Where Elegance Meets Technology. Curated for the few.
            </p>
            <div className="pt-8 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#eab308] to-[#a855f7] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <button
                onClick={() => {
                  const el = document.getElementById('products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative neon-button px-16 py-5 text-xl font-bold bg-[#111111] rounded-full"
              >
                Enter The Experience
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-32 px-6 lg:px-12 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col mb-20">
            <h2 className="text-white text-4xl lg:text-5xl font-black uppercase italic tracking-tighter mb-4">
              The <span className="text-[#eab308]">Curated</span> Collection
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-[#eab308] to-[#a855f7] rounded-full" />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#a855f7] border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
              <p className="text-white/40 font-bold uppercase tracking-[0.3em] animate-pulse">Fetching Masterpieces...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {allProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onSelect={() => openModal(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </main>
  );
}
