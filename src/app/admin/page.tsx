'use client';

import { useEffect, useState } from 'react';
import { login, logout, checkAuth } from '../actions/auth';
import { addProduct, deleteAllProducts } from '../actions/products';
import { storage, BUCKET_ID, ID, client } from '@/lib/appwrite';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);

    // Manual Form State
    const [showRepairGuide, setShowRepairGuide] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState('');
    const [manualProduct, setManualProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '5',
        images: [] as (string | File)[]
    });

    useEffect(() => {
        const verifyAuth = async () => {
            const authenticated = await checkAuth();
            setIsAdmin(authenticated);
        };
        verifyAuth();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(password);
        if (result.success) {
            setIsAdmin(true);
        } else {
            alert('❌ رمز الدخول غير صحيح!');
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await logout();
        setIsAdmin(false);
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#111111] px-6">
                <div className="max-w-md w-full card-bg neon-border-purple p-10 rounded-[2.5rem] glass-morphism-premium artistic-shadow text-center">
                    <div className="w-20 h-20 bg-[#a855f7]/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#a855f7]/30">
                        <svg className="w-10 h-10 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Admin Access</h2>
                    <p className="text-white/40 mb-8 text-sm">Please enter your authorization code to proceed.</p>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full search-input rounded-2xl px-6 py-5 text-center text-2xl tracking-[0.5em] font-black text-white/90 placeholder-white/10 focus:ring-2 focus:ring-[#a855f7]/50"
                            autoFocus
                        />
                        <button
                            disabled={loading}
                            className="w-full py-5 bg-[#a855f7] text-white rounded-2xl font-black hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Authorize Access'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 md:pt-40 pb-20 px-4 md:px-6 bg-[#111111]">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-6 mb-10 md:mb-16">
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tighter">
                            <span className="text-[#eab308]">EASY</span>
                            <span className="text-[#a855f7] ml-3 lowercase text-glow-purple">dashboard</span>
                        </h1>
                        <p className="text-white/40 text-sm md:text-lg">Manage your curated product collection.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => window.open('/', '_blank')}
                            className="card-bg neon-border-purple px-4 py-2.5 rounded-2xl text-white text-sm font-bold hover:bg-white/5 transition-all"
                        >
                            View Store
                        </button>

                        <button
                            onClick={async () => {
                                if (confirm('🚨 هل أنت متأكد من مسح جميع المنتجات؟')) {
                                    setLoading(true);
                                    try {
                                        await deleteAllProducts();
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
                            className="px-4 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all"
                        >
                            مسح الكل
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-sm font-bold hover:text-white transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            خروج
                        </button>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Add Product Form */}
                    <div className="card-bg rounded-3xl md:rounded-[2.5rem] p-5 md:p-10 lg:p-14 transition-all neon-border-purple glass-morphism-premium artistic-shadow">
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

                            try {
                                const result = await addProduct(productData, manualProduct.images);

                                if (result.success) {
                                    localStorage.removeItem('easy_shop_products');
                                    setManualProduct({ name: '', price: '', description: '', rating: '5', images: [] });
                                    alert('✅ تم إضافة المنتج بنجاح!');
                                } else {
                                    alert(`❌ فشل في إضافة المنتج.`);
                                }
                            } catch (err: any) {
                                console.error('Upload error:', err);
                                alert('❌ حدث خطأ أثناء الرفع، جرب صوراً بحجم أصغر قليلاً أو تأكد من الإنترنت.');
                            } finally {
                                setLoading(false);
                            }
                        }} className="space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
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
                                                    const file = new File([blob], `pasted-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`, { type: blob.type });
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

                            {showRepairGuide && (
                                <div className="mt-8 p-8 bg-red-500/10 border-2 border-red-500/30 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl animate-pulse">⚠️</div>
                                        <div>
                                            <h3 className="text-xl font-black text-white">تحذير: نظام الصور غير مفعل</h3>
                                            <p className="text-white/60 text-sm">يجب إنشاء مخزن (Bucket) في Appwrite لتفعيل الجودة العالية.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                            <p className="text-[#a855f7] font-bold mb-2">الخطوة 1: افتح لوحة تحكم Appwrite</p>
                                            <p className="text-white/40 text-sm mb-2">ادخل على مشروعك في Appwrite وروح لـ Storage.</p>
                                            <a
                                                href="https://cloud.appwrite.io/console"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 break-all text-sm underline font-mono"
                                            >
                                                https://cloud.appwrite.io/console
                                            </a>
                                        </div>

                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                            <p className="text-[#eab308] font-bold mb-2">الخطوة 2: أنشئ الـ Bucket</p>
                                            <ul className="text-white/70 text-sm space-y-2 list-disc list-inside">
                                                <li>اضغط على الـ Bucket اللي اسمه <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-white">product_images</span></li>
                                                <li>ادخل على <span className="text-white font-bold">Settings</span></li>
                                                <li>عند <span className="text-white font-bold">Permissions</span> ضيف Role باسم <span className="text-white font-bold">Any</span></li>
                                                <li>فعل <span className="text-white font-bold">Create</span> و <span className="text-white font-bold">Read</span></li>
                                            </ul>
                                        </div>

                                        <button
                                            onClick={() => setShowRepairGuide(false)}
                                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 text-xs rounded-xl font-bold transition-colors"
                                        >
                                            خفاء الدليل ومحاولة أخرى
                                        </button>
                                    </div>
                                </div>
                            )}

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
