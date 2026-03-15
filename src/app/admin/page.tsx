'use client';

import { useState } from 'react';
import { databases, storage, client, DATABASE_ID, COLLECTION_ID, BUCKET_ID, ID } from '@/lib/appwrite';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);

    // Manual Form State
    const [manualProduct, setManualProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '5',
        images: [] as (string | File)[]
    });

    const pushToAppwrite = async (product: any) => {
        try {
            const uploadedImageUrls: string[] = [];

            // 1. Upload files to Appwrite Storage first
            for (const img of manualProduct.images) {
                if (img instanceof File) {
                    const file = await storage.createFile(
                        BUCKET_ID,
                        ID.unique(),
                        img
                    );
                    // Generate public URL
                    const url = `${client.config.endpoint}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${client.config.project}`;
                    uploadedImageUrls.push(url);
                } else {
                    // It's already a URL
                    uploadedImageUrls.push(img);
                }
            }

            // 2. Create document with the URLs
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    rating: product.rating,
                    image: uploadedImageUrls[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
                    images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop']
                }
            );
            return { success: true };
        } catch (error: any) {
            console.error('Error pushing to Appwrite:', error);
            return {
                success: false,
                message: error.message || 'Unknown error',
                code: error.code
            };
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-[#111111]">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tighter">
                            <span className="text-[#eab308]">EASY</span>
                            <span className="text-[#a855f7] ml-3 lowercase text-glow-purple">dashboard</span>
                        </h1>
                        <p className="text-white/40 text-lg">Manage your curated product collection.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.open('/', '_blank')}
                            className="card-bg neon-border-purple px-6 py-3 rounded-2xl text-white font-bold hover:bg-white/5 transition-all"
                        >
                            View Store
                        </button>

                        <div className="card-bg neon-border-purple px-8 py-5 rounded-3xl flex items-center gap-5 glass-morphism-premium artistic-shadow">
                            <div className="w-12 h-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center border border-red-500/30">
                                <button
                                    onClick={async () => {
                                        if (confirm('🚨 هل أنت متأكد من مسح جميع المنتجات؟')) {
                                            setLoading(true);
                                            try {
                                                const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
                                                for (const doc of docs.documents) {
                                                    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id);
                                                }
                                                localStorage.removeItem('easy_shop_products');
                                                alert('✅ تم مسح جميع المنتجات بنجاح!');
                                                window.location.reload();
                                            } catch (e) {
                                                alert('خطأ في الاتصال أو الصلاحيات');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }
                                    }}
                                    className="text-red-500 font-bold text-xs"
                                >
                                    مسح الكل
                                </button>
                            </div>
                            <div>
                                <div className="text-white font-bold text-lg">Admin User</div>
                                <div className="text-[10px] text-[#a855f7] uppercase tracking-[0.3em] font-black">Verified Store</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Add Product Form */}
                    <div className="card-bg rounded-[2.5rem] p-10 lg:p-14 transition-all neon-border-purple glass-morphism-premium artistic-shadow">
                        <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-4">
                            <span className="w-1.5 h-8 rounded-full bg-[#3b82f6] shadow-[0_0_15px_#3b82f6]" />
                            Craft Manual Product
                        </h2>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);
                            const productData = {
                                name: manualProduct.name,
                                price: parseInt(manualProduct.price) || 0,
                                description: manualProduct.description,
                                rating: parseFloat(manualProduct.rating) || 5,
                                image: manualProduct.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
                                images: manualProduct.images.length > 0 ? manualProduct.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop']
                            };

                            const result = await pushToAppwrite(productData);

                            if (result.success) {
                                // Clear localStorage old data if any
                                localStorage.removeItem('easy_shop_products');
                                setLoading(false);
                                setManualProduct({ name: '', price: '', description: '', rating: '5', images: [] });
                                alert('✅ تم إضافة المنتج إلى Appwrite بنجاح!');
                            } else {
                                setLoading(false);
                                alert(`❌ فشل في إضافة المنتج.\nالسبب: ${result.message}\nالكود: ${result.code}\n\nتأكد من تفعيل صلاحيات الـ Create للكل (Any) في إعدادات الـ Collection.`);
                            }
                        }} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-[#3b82f6] uppercase tracking-[0.2em]">اسم المنتج</label>
                                    <input
                                        type="text"
                                        value={manualProduct.name}
                                        onChange={(e) => setManualProduct({ ...manualProduct, name: e.target.value })}
                                        className="w-full search-input rounded-2xl px-6 py-4 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-[#3b82f6]/50"
                                        placeholder="أدخل اسم المنتج هنا..."
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-[#3b82f6] uppercase tracking-[0.2em]">السعر</label>
                                    <input
                                        type="number"
                                        value={manualProduct.price}
                                        onChange={(e) => setManualProduct({ ...manualProduct, price: e.target.value })}
                                        className="w-full search-input rounded-2xl px-6 py-4 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-[#3b82f6]/50"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-[#3b82f6] uppercase tracking-[0.2em]">الوصف</label>
                                <textarea
                                    value={manualProduct.description}
                                    onChange={(e) => setManualProduct({ ...manualProduct, description: e.target.value })}
                                    rows={4}
                                    className="w-full search-input rounded-2xl px-6 py-4 text-white/90 placeholder-white/20 focus:ring-2 focus:ring-[#3b82f6]/50 custom-scrollbar"
                                    placeholder="أدخل مواصفات المنتج..."
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-[#eab308] uppercase tracking-[0.2em]">التقييم (1-5)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                    value={manualProduct.rating}
                                    onChange={(e) => setManualProduct({ ...manualProduct, rating: e.target.value })}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#eab308]"
                                />
                                <div className="flex justify-between text-white/40 text-[10px] font-bold">
                                    <span>1.0</span>
                                    <span className="text-[#eab308] text-lg">{manualProduct.rating} Stars</span>
                                    <span>5.0</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-[#a855f7] uppercase tracking-[0.2em]">صور المنتج (دقة عالية)</label>

                                <div className="flex flex-wrap gap-4">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            setManualProduct(prev => ({
                                                ...prev,
                                                images: [...prev.images, ...files]
                                            }));
                                        }}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="px-8 py-5 bg-[#3b82f6] text-white rounded-2xl font-black cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-3 active:scale-95"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        رفع صور بدقة عالية
                                    </label>

                                    <div className="flex-1 min-w-[200px]">
                                        <input
                                            type="text"
                                            placeholder="أو ضع رابط صورة هنا..."
                                            className="w-full search-input rounded-2xl px-6 py-5 text-white/90 placeholder-white/20"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = (e.currentTarget as HTMLInputElement).value.trim();
                                                    if (val) {
                                                        setManualProduct(prev => ({ ...prev, images: [...prev.images, val] }));
                                                        (e.currentTarget as HTMLInputElement).value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div
                                    onPaste={async (e) => {
                                        const items = e.clipboardData.items;
                                        for (let i = 0; i < items.length; i++) {
                                            if (items[i].type.indexOf('image') !== -1) {
                                                const blob = items[i].getAsFile();
                                                if (blob) {
                                                    const file = new File([blob], `pasted-${Date.now()}.jpg`, { type: 'image/jpeg' });
                                                    setManualProduct(prev => ({
                                                        ...prev,
                                                        images: [...prev.images, file]
                                                    }));
                                                }
                                            }
                                        }
                                    }}
                                    className="w-full min-h-[150px] border-2 border-dashed border-white/10 rounded-[2rem] flex flex-wrap gap-4 p-6 items-center justify-center hover:border-[#3b82f6]/30 transition-colors cursor-pointer group"
                                >
                                    {manualProduct.images.length === 0 ? (
                                        <div className="text-center">
                                            <p className="text-white/40 text-sm">أو اعمل Paste للصورة هنا مباشرة</p>
                                            <p className="text-white/10 text-[10px] mt-2 italic">الصور يتم رفعها بجودة كاملة وبدون ضغط</p>
                                        </div>
                                    ) : (
                                        <>
                                            {manualProduct.images.map((img, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden group/img">
                                                    <img
                                                        src={img instanceof File ? URL.createObjectURL(img) : img}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setManualProduct(prev => ({
                                                                ...prev,
                                                                images: prev.images.filter((_, i) => i !== idx)
                                                            }));
                                                        }}
                                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="w-24 h-24 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs text-center p-2">
                                                Paste/Upload More...
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={loading || !manualProduct.name || !manualProduct.price}
                                className="w-full py-6 text-2xl tracking-widest uppercase font-black rounded-3xl transition-all bg-[#3b82f6] text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding Masterpiece...' : 'Add Product to Store'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
