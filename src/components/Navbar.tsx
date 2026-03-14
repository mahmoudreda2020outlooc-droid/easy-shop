import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center bg-[#111111] border-b border-white/5 pb-4 pt-4 px-6 md:px-12 w-full">
            {/* Top Row: Logo, Search, User Actions */}
            <div className="w-full max-w-[1400px] flex items-center justify-between mb-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-widest font-['Inter']">
                        <span className="text-[#eab308]">EASY</span>
                        <span className="text-[#a855f7] ml-2">SHOP</span>
                    </span>
                </Link>



                {/* User Actions */}
                <div className="flex items-center gap-6">
                    <Link href="/cart" className="relative flex items-center text-white/80 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {/* Neon Purple Badge */}
                        <span className="absolute -top-2 -right-2 bg-[#a855f7] rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.8)] border-2 border-[#111111]">
                            11
                        </span>
                    </Link>
                </div>
            </div>

        </nav>
    );
}
