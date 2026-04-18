"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileUp, Verified, FileX, Archive } from "lucide-react";

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Verifikasi Sandi", path: "/verify", icon: <Verified size={18} /> },
    { name: "Arsip Disahkan", path: "/history", icon: <Archive size={18} /> },
    { name: "Dokumen Terhapus", path: "/trash", icon: <FileX size={18} /> },
  ];

  if (user?.role === "kph") {
    navItems.splice(1, 0, { name: "Unggah Baru", path: "/upload", icon: <FileUp size={18} /> });
  }

  return (
    <aside className="w-64 bg-[#18181b] flex flex-col h-screen shrink-0 z-20">
      {/* Brand Logo Area */}
      <div className="h-16 flex items-center px-6 gap-3 mb-4 mt-2">
        <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700/50">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
          </svg>
        </div>
        <h2 className="text-[15px] font-bold text-zinc-100 tracking-wide uppercase">PERHUTANI <span className="font-normal text-zinc-400">GRUP</span></h2>
      </div>

      <div className="px-6 mb-2">
        <p className="text-[11px] font-semibold text-zinc-500 tracking-widest uppercase">Menu Utama</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? "bg-[#27272a] text-zinc-100 shadow-sm border border-zinc-700/30" 
                  : "text-zinc-400 hover:bg-[#27272a]/50 hover:text-zinc-200"
              }`}
            >
              <div className={isActive ? "text-emerald-500" : "text-zinc-500"}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
