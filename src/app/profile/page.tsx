"use client";

import { useState } from "react";
import DashboardLayout, { useAuth } from "../../components/DashboardLayout";
import { useRouter } from "next/navigation";

function ProfileContent() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/edit_profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username: newUsername, password: newPassword })
      });
      const data = await res.json();
      
      alert(data.message);
      
      if (data.status === "success" && newPassword) {
        // If password changed, they probably should re-login with new rules
        alert("Sandi berhasil diubah! Anda akan dialihkan ke halaman login ulang.");
        localStorage.removeItem("token");
        router.push("/login");
      } else if (data.status === "success" && newUsername !== user.username) {
        // Refresh token natively by reloading
        window.location.reload();
      }
    } catch (e) {
      alert("Error gagal mengubah profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-500 pt-8">
      <div className="bg-[#1C1C1F] border border-zinc-800 shadow-xl p-10 lg:p-14 rounded-xl">
        <div className="w-24 h-24 bg-[#111111] text-zinc-300 mx-auto rounded-full flex items-center justify-center font-black text-5xl mb-6 shadow-inner border border-zinc-800">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <h1 className="text-3xl font-black text-center text-white tracking-tight mb-2">Edit Profil Pengguna</h1>
        <p className="text-center text-zinc-400 font-medium mb-10">
          Ubah konfigurasi akun untuk Role: <span className="uppercase text-emerald-500 font-bold">{user?.role}</span>
        </p>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">Ganti Username</label>
            <input 
              type="text" 
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              className="w-full bg-[#111111] border border-zinc-800 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white font-medium shadow-inner" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Ganti Password (Kosongkan jika tidak ingin ganti)</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Sandi baru..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-black dark:text-white font-medium" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/30 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <DashboardLayout><ProfileContent/></DashboardLayout>;
}
