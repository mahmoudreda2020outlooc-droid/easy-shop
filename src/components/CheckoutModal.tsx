'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
    name: string;
    price: number;
    image: string;
    images?: string[];
    description?: string;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone1: '',
        phone2: '',
        province: '',
        address: ''
    });

    // Ensure we have an array of images for the gallery
    const productImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image];

    const provinces = [
        "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "الشرقية", "السويس", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج", "المحلة", "العاشر من رمضان", "طنطا", "وادي النطرون", "الساحل الشمالي", "العين السخنة"
    ];

    const shippingRates: Record<string, number> = {
        "القاهرة": 75, "الجيزة": 75, "الإسكندرية": 75,
        "بور سعيد": 80, "بورسعيد": 80, "كفر الشيخ": 80, "المحلة": 80, "العاشر من رمضان": 80, "طنطا": 80, "بني سويف": 80, "دمياط": 80, "البحيرة": 80, "الدقهلية": 80, "الشرقية": 80, "الغربية": 80, "القليوبية": 80, "الاسماعيلية": 80, "الإسماعيلية": 80, "السويس": 80, "المنوفية": 80,
        "المنيا": 85, "وادي النطرون": 85, "مطروح": 85, "الأقصر": 85, "الساحل الشمالي": 85, "البحر الأحمر": 85, "سوهاج": 85, "أسيوط": 85, "الفيوم": 85, "العين السخنة": 85, "أسوان": 85, "قنا": 85, "الوادي الجديد": 85, "شمال سيناء": 85, "جنوب سيناء": 85
    };

    const [showManualProvince, setShowManualProvince] = useState(false);
    const [manualProvince, setManualProvince] = useState('');

    const currentProvince = showManualProvince ? manualProvince.trim() : formData.province;

    const getShippingCost = (province: string) => {
        if (!province) return 0;
        if (shippingRates[province]) return shippingRates[province];
        const normalize = (str: string) => str.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').trim();
        const normalizedProvince = normalize(province);
        const matchedKey = Object.keys(shippingRates).find(key => normalize(key) === normalizedProvince);
        return matchedKey ? shippingRates[matchedKey] : 85;
    };

    const shippingCost = getShippingCost(currentProvince);
    const totalPrice = (product.price * quantity) + shippingCost;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCurrentImageIndex(0); // Reset to first image when modal opens
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProvince = showManualProvince ? manualProvince : formData.province;
        const message = `طلب جديد لمتجر Easy Shop:
المنتج: ${product.name}
الكمية: ${quantity}
سعر القطعة: ${product.price} ج.م
سعر الشحن: ${shippingCost} ج.م (محافظة ${finalProvince})
الأجمالي: ${totalPrice} ج.م

بيانات العميل:
الاسم: ${formData.fullName}
الهاتف 1: ${formData.phone1}
الهاتف 2: ${formData.phone2 || 'لا يوجد'}
العنوان: ${formData.address}`;

        window.open(`https://wa.me/201281354796?text=${encodeURIComponent(message)}`, '_blank');
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6 overflow-hidden">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <div className="relative w-full max-w-6xl bg-[#111111] rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10 animate-in fade-in zoom-in duration-300 max-h-[92vh] flex flex-col overflow-hidden artistic-shadow glass-morphism-premium">

                    {/* Scrollable Container */}
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

                            {/* Left Side: Product Info / Gallery */}
                            <div className="p-10 lg:p-16 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
                                <div className="flex-1">
                                    {/* Main Image Display with Navigation */}
                                    <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-6 border border-white/10 bg-black/40 artistic-shadow group">
                                        <Image
                                            src={productImages[currentImageIndex]}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-6 transition-all duration-700 ease-in-out transform group-hover:scale-105 cursor-zoom-in"
                                            onClick={() => setLightboxOpen(true)}
                                        />

                                        {/* Zoom Button */}
                                        <button
                                            onClick={() => setLightboxOpen(true)}
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#a855f7]/80 transition-all opacity-0 group-hover:opacity-100 z-10"
                                            title="تكبير الصورة"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                        </button>

                                        {productImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1)); }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#a855f7] hover:scale-110 active:scale-95"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1)); }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#eab308] hover:scale-110 active:scale-95"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnails Selection */}
                                    {productImages.length > 1 && (
                                        <div className="flex flex-wrap gap-3 mb-10 justify-center lg:justify-end">
                                            {productImages.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-[#a855f7] scale-110 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-white/5 hover:border-white/20'}`}
                                                >
                                                    <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <h2 className="text-4xl font-bold text-white mb-6 tracking-tight text-right text-glow-purple">{product.name}</h2>

                                    {product.description && (
                                        <div className="mb-10 p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 dir-rtl artistic-shadow">
                                            <h4 className="text-[#eab308] font-bold text-xs uppercase tracking-[0.3em] mb-4">المواصفات والتفاصيل</h4>
                                            <div className="text-white/60 text-sm leading-loose whitespace-pre-wrap">
                                                {product.description}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center justify-end gap-8 mb-10">
                                        <div className="flex items-center bg-black/60 rounded-full border border-white/10 px-5 py-2.5 shadow-2xl">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                className="w-10 h-10 flex items-center justify-center text-white/30 hover:text-[#a855f7] transition-all font-bold text-3xl active:scale-90"
                                            >
                                                −
                                            </button>
                                            <span className="w-14 text-center text-white font-black text-3xl">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(prev => prev + 1)}
                                                className="w-10 h-10 flex items-center justify-center text-white/30 hover:text-[#eab308] transition-all font-bold text-3xl active:scale-90"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-6xl font-black text-[#eab308] text-glow-gold tracking-tighter">{product.price * quantity} ج.م</span>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/10 mt-10">
                                    <div className="flex justify-between items-center text-white/50 mb-4 font-bold text-xl dir-rtl">
                                        <span>سعر المنتجات:</span>
                                        <span className="text-white">{product.price * quantity} ج.م</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/50 mb-8 font-bold text-xl dir-rtl">
                                        <span>مصاريف الشحن:</span>
                                        <span className={shippingCost > 0 ? "text-white" : "text-[#a855f7] font-black animate-pulse"}>
                                            {shippingCost > 0 ? `${shippingCost} ج.م` : "اختر المحافظة"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/10 shadow-inner dir-rtl">
                                        <span className="text-2xl font-black text-white uppercase tracking-widest">الإجمالي:</span>
                                        <span className="text-5xl font-black text-[#eab308] drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]">{totalPrice} ج.م</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Shipping Form */}
                            <div className="p-10 lg:p-16 flex flex-col">
                                <div className="flex items-center justify-between mb-12">
                                    <h3 className="text-3xl font-black text-white tracking-widest uppercase italic">بيانات التوصيل</h3>
                                    <button type="button" onClick={onClose} className="text-white/20 hover:text-white transition-all p-3 hover:rotate-90">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-[#a855f7] uppercase tracking-[0.4em] font-black mr-2 block text-right">الاسم بالكامل</label>
                                        <input
                                            type="text"
                                            placeholder="الاسم بالكامل"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#a855f7] focus:bg-white/[0.08] transition-all text-right font-bold text-lg"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#a855f7] uppercase tracking-[0.4em] font-black mr-2 block text-right">رقم الهاتف الأول</label>
                                            <input
                                                type="tel"
                                                placeholder="رقم الهاتف الأول"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#a855f7] focus:bg-white/[0.08] transition-all text-right font-bold text-lg"
                                                required
                                                value={formData.phone1}
                                                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#eab308] uppercase tracking-[0.4em] font-black mr-2 block text-right">رقم هاتف ثانٍ</label>
                                            <input
                                                type="tel"
                                                placeholder="رقم هاتف ثانٍ"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#eab308] focus:bg-white/[0.08] transition-all text-right font-bold text-lg"
                                                value={formData.phone2}
                                                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] text-[#a855f7] uppercase tracking-[0.4em] font-black mr-2 block text-right">المحافظة</label>
                                        <div className="relative">
                                            {!showManualProvince ? (
                                                <select
                                                    required
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white appearance-none focus:outline-none focus:border-[#a855f7] focus:bg-white/[0.08] transition-all cursor-pointer text-right transition-all font-bold text-lg"
                                                    value={formData.province}
                                                    onChange={(e) => {
                                                        if (e.target.value === "OTHER") {
                                                            setShowManualProvince(true);
                                                            setFormData({ ...formData, province: '' });
                                                        } else {
                                                            setFormData({ ...formData, province: e.target.value });
                                                        }
                                                    }}
                                                >
                                                    <option value="" className="bg-[#111111]">اختر المحافظة</option>
                                                    <option value="OTHER" className="bg-[#111111] font-black text-[#eab308]">أخرى (كتابة يدوية)</option>
                                                    {provinces.sort().map(p => (
                                                        <option key={p} value={p} className="bg-[#111111]">{p}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="اكتب اسم المحافظة هنا"
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#a855f7] focus:bg-white/[0.08] transition-all text-right font-bold text-lg"
                                                        required
                                                        value={manualProvince}
                                                        onChange={(e) => setManualProvince(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowManualProvince(false)}
                                                        className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] text-[#eab308] font-black hover:underline uppercase"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                            {!showManualProvince && (
                                                <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] text-[#a855f7] uppercase tracking-[0.4em] font-black mr-2 block text-right">العنوان بالتفصيل</label>
                                        <textarea
                                            placeholder="العنوان بالتفصيل ( اسم الشارع / رقم العقار / الدور ... )"
                                            rows={4}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#a855f7] focus:bg-white/[0.08] transition-all resize-none text-right font-bold text-lg custom-scrollbar"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#a855f7] via-[#eab308] to-[#a855f7] bg-[length:200%_auto] text-white font-black py-6 rounded-3xl shadow-[0_15px_40px_rgba(168,85,247,0.3)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.5)] transition-all active:scale-[0.98] mt-6 uppercase tracking-[0.4em] text-xl animate-shimmer"
                                    >
                                        Confirm Order
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Full Screen Overlay */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-xl"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10 hover:rotate-90"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image Counter */}
                    {productImages.length > 1 && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-5 py-2 rounded-full text-white/60 text-sm font-bold border border-white/10">
                            {currentImageIndex + 1} / {productImages.length}
                        </div>
                    )}

                    {/* Main Lightbox Image */}
                    <div
                        className="relative w-full h-full max-w-5xl max-h-[85vh] mx-auto px-16 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={productImages[currentImageIndex]}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain select-none"
                            style={{ filter: 'drop-shadow(0 0 60px rgba(168,85,247,0.2))' }}
                        />

                        {/* Prev / Next arrows */}
                        {productImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => p === 0 ? productImages.length - 1 : p - 1); }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-[#a855f7] transition-all hover:scale-110"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => p === productImages.length - 1 ? 0 : p + 1); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-[#eab308] transition-all hover:scale-110"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {productImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                            {productImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx
                                        ? 'border-[#a855f7] scale-110 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                                        : 'border-white/10 opacity-50 hover:opacity-80'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
