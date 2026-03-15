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
                    {/* User Actions removed */}
                </div>
            </div>

        </nav>
    );
}
