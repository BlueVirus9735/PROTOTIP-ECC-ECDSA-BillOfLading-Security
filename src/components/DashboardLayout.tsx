"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

interface AuthContextType {
  user: any;
  token: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within DashboardLayout");
  return ctx;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!localToken) {
      router.push("/login");
    } else {
      setToken(localToken);
      fetch("http://localhost:8000/api/me.php", {
        method: "POST",
        body: JSON.stringify({ token: localToken })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#111] space-y-4 flex-col text-zinc-500">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return null;

  return (
    <AuthContext.Provider value={{ user, token }}>
      <div className="flex h-screen bg-[#111111] overflow-hidden font-sans">
        
        {/* Left Panel */}
        <Sidebar user={user} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Top Navbar Header */}
          <header className="h-16 flex items-center justify-between px-8 bg-[#18181b] border-b border-black shrink-0 relative z-10">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-zinc-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </span>
              <span className="text-[13px] font-medium tracking-wide">Dashboard Manajemen RTT</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/profile" className="text-zinc-400 hover:text-white transition-colors" title="Pengaturan">
                <Settings size={18} />
              </Link>
              <div className="flex items-center gap-3 border-l border-zinc-800 pl-6 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                  {user?.username?.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-400 transition-colors" title="Keluar">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {/* Interactive Page Container */}
          <main className="flex-1 overflow-y-auto px-8 py-6 pb-24 relative hide-scrollbar">
             {children}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
