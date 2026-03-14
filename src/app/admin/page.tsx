'use client';

import { useState } from 'react';

const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxooB4SU0-JBXd-0EBAhp6jonWidCuf0t5QNGqWkLVHzZth2VpdUk7fZ5nIPXl2XGu5lg/exec';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
    const [taagerUrl, setTaagerUrl] = useState('');
    const [multiImages, setMultiImages] = useState('');
    const [bulkUrls, setBulkUrls] = useState('');
    const [loading, setLoading] = useState(false);

    const mockTaagerData: Record<string, any> = {
        "EG040302EYRU99": {
            id: 'EG040302EYRU99',
            name: 'Imperial Gold Chronograph',
            price: 1850,
            image: 'https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1974&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1974&auto=format&fit=crop'],
            rating: 5,
            isGold: true,
            description: 'ساعة يد فاخرة بتصميم كرونوغراف إمبراطوري، تتميز بمينا ذهبي مصقول وسوار من الجلد الإيطالي الفاخر. مقاومة للماء حتى عمق 50 متراً.'
        }
    };

    const parseTaagerDescription = (text: string) => {
        // Look for price patterns like "180" or "180 ج.م" or "السعر: 180"
        const priceMatch = text.match(/(\d+)[\s]*ج\.م/i) || text.match(/السعر[:\s]+(\d+)/i) || text.match(/^(\d+)$/m);
        const price = priceMatch ? parseInt(priceMatch[1]) : 500;

        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const name = lines[0]?.substring(0, 60) || 'New Product';

        // Return cleaned up description
        return { name, price, description: text };
    };

    const pushToSheet = async (product: any) => {
        try {
            await fetch(SHEETS_API_URL, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requires no-cors for simple POST or it will fail preflight
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            return true;
        } catch (error) {
            console.error('Error pushing to sheet:', error);
            return false;
        }
    };

    const handleSingleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let productData;
        const trimmedInput = taagerUrl.trim();
        const imageUrls = multiImages.split('\n').map(url => url.trim()).filter(url => url.length > 0);

        // Check if it's a known SKU first
        if (mockTaagerData[trimmedInput]) {
            productData = { ...mockTaagerData[trimmedInput] };
        } else {
            const parsed = parseTaagerDescription(taagerUrl);
            productData = {
                id: Math.random().toString(36).substr(2, 9),
                ...parsed,
                image: imageUrls[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
                images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'],
                rating: 5,
                isGold: true
            };
        }

        // Push to Sheet
        await pushToSheet(productData);

        // Also save to localStorage as backup
        const existing = JSON.parse(localStorage.getItem('easy_shop_products') || '[]');
        localStorage.setItem('easy_shop_products', JSON.stringify([...existing, productData]));

        setLoading(false);
        setTaagerUrl('');
        setMultiImages('');
        alert('✅ تم سحب البيانات ورفعها بنجاح! المنتج سيظهر للجميع فوراً.');
    };

    const handleBulkAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const items = bulkUrls.split('---').filter(item => item.trim().length > 0);

        setLoading(true);
        const newProducts = [];

        for (const item of items) {
            const parsed = parseTaagerDescription(item);
            const productData = {
                id: Math.random().toString(36).substr(2, 9),
                ...parsed,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'],
                rating: 4.5,
                isGold: false
            };
            newProducts.push(productData);
            await pushToSheet(productData);
        }

        const existing = JSON.parse(localStorage.getItem('easy_shop_products') || '[]');
        localStorage.setItem('easy_shop_products', JSON.stringify([...existing, ...newProducts]));

        setLoading(false);
        setBulkUrls('');
        alert(`✅ تم إضافة ${newProducts.length} منتجات ورفعهم بنجاح!`);
    };

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-[#111111]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tighter">
                            <span className="text-[#eab308]">EASY</span>
                            <span className="text-[#a855f7] ml-3 lowercase text-glow-purple">dashboard</span>
                        </h1>
                        <p className="text-white/40 text-lg">Manage your curated product collection from Taager.</p>
                    </div>

                    <div className="card-bg neon-border-purple px-8 py-5 rounded-3xl flex items-center gap-5 glass-morphism-premium artistic-shadow">
                        <div className="w-12 h-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center border border-red-500/30">
                            <button
                                onClick={async () => {
                                    if (confirm('🚨 هل أنت متأكد من مسح جميع المنتجات؟')) {
                                        setLoading(true);
                                        try {
                                            await fetch(SHEETS_API_URL, {
                                                method: 'POST',
                                                mode: 'no-cors',
                                                body: JSON.stringify({ action: 'clear' }),
                                            });
                                            localStorage.removeItem('easy_shop_products');
                                            alert('✅ تم إرسال طلب المسح. تأكد من تحديث صفحة الموقع.');
                                            window.location.reload();
                                        } catch (e) {
                                            alert('خطأ في الاتصال');
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">

                        {/* Tab Switcher */}
                        <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
                            <button
                                onClick={() => setActiveTab('single')}
                                className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'single' ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] text-glow-purple' : 'text-white/40 hover:text-white'}`}
                            >
                                Smart Pull
                            </button>
                            <button
                                onClick={() => setActiveTab('bulk')}
                                className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'bulk' ? 'bg-[#eab308] text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'text-white/40 hover:text-white'}`}
                            >
                                Batch Import
                            </button>
                        </div>

                        {/* Add Product Form */}
                        <div className={`card-bg rounded-[2.5rem] p-10 lg:p-14 transition-all ${activeTab === 'single' ? 'neon-border-purple' : 'neon-border-gold'} glass-morphism-premium artistic-shadow`}>
                            <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-4">
                                <span className={`w-1.5 h-8 rounded-full transition-all shadow-[0_0_15px] ${activeTab === 'single' ? 'bg-[#a855f7] shadow-[#a855f7]' : 'bg-[#eab308] shadow-[#eab308]'}`} />
                                {activeTab === 'single' ? 'Automatic Product Pull' : 'Batch Description Import'}
                            </h2>

                            {activeTab === 'single' ? (
                                <form onSubmit={handleSingleAdd} className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-[#a855f7] uppercase tracking-[0.2em] ml-1">Paste Taager Description / URL</label>
                                        <textarea
                                            value={taagerUrl}
                                            onChange={(e) => setTaagerUrl(e.target.value)}
                                            rows={6}
                                            placeholder="Copy product name, price, and specs from Taager and paste them here..."
                                            className="w-full search-input rounded-3xl px-8 py-6 text-white/90 text-lg placeholder-white/20 custom-scrollbar focus:ring-2 focus:ring-[#a855f7]/50"
                                            required
                                        />
                                        <p className="text-white/20 text-[11px] italic ml-2">Tip: Our AI will automatically extract the price and title from the text.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-[#eab308] uppercase tracking-[0.2em] ml-1 text-right">رابط صور المنتج (يمكنك وضع أكثر من رابط.. كل رابط في سطر)</label>
                                        <textarea
                                            value={multiImages}
                                            onChange={(e) => setMultiImages(e.target.value)}
                                            rows={4}
                                            placeholder="رابط الصورة 1&#10;رابط الصورة 2..."
                                            className="w-full search-input rounded-3xl px-8 py-6 text-white/90 text-sm placeholder-white/20 text-right focus:ring-2 focus:ring-[#eab308]/50 custom-scrollbar"
                                        />
                                        <p className="text-white/20 text-[10px] text-right italic mr-2">انسخ عنوان كل صورة من تاجر وضعه هنا في سطر منفصل</p>
                                    </div>

                                    <button
                                        disabled={loading}
                                        className="w-full neon-button py-6 text-2xl tracking-widest uppercase font-black disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <span className="group-hover:text-glow-purple transition-all">
                                            {loading ? 'Sinking to Cloud Sheet...' : 'Pull & Sync Product'}
                                        </span>
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleBulkAdd} className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-[#eab308] uppercase tracking-[0.2em] ml-1">Paste Multiple Descriptions</label>
                                        <p className="text-white/20 text-xs italic ml-1 mb-4">Use '---' (three dashes) to separate different products.</p>
                                        <textarea
                                            value={bulkUrls}
                                            onChange={(e) => setBulkUrls(e.target.value)}
                                            rows={10}
                                            placeholder="Product 1 specs...&#10;---&#10;Product 2 specs..."
                                            className="w-full search-input rounded-3xl px-8 py-6 text-white/90 text-lg placeholder-white/20 font-mono text-sm leading-relaxed custom-scrollbar"
                                            required
                                        />
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="w-full py-6 text-2xl tracking-widest uppercase font-black rounded-3xl transition-all bg-[#eab308] text-slate-950 hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Syncing Batch Collection...' : 'Import & Sync All'}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        {/* Status Card */}
                        <div className="card-bg neon-border-gold rounded-[2.5rem] p-10 space-y-10 glass-morphism-premium artistic-shadow">
                            <h3 className="text-xl font-bold text-white tracking-widest uppercase text-glow-gold">Live Stats</h3>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Sync Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                                        <span className="text-2xl font-bold text-blue-500 italic">Cloud Sheets</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Store Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                                        <span className="text-2xl font-bold text-green-500">Live & Selling</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="card-bg neon-border-purple rounded-[2.5rem] p-10 glass-morphism-premium">
                            <h3 className="text-xl font-bold text-[#a855f7] mb-6 tracking-tight">Cloud Management</h3>
                            <p className="text-white/60 leading-relaxed text-sm">
                                "Your products are now safely stored in Google Sheets. You can edit them directly in the sheet or via this dashboard!"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
