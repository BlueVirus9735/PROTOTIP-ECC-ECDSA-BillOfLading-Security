"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost/pelindo/api/keygen.php");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      alert("Gagal terhubung ke PHP. Pastikan Laragon sudah menyala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <section className="relative overflow-hidden rounded-[3rem] bg-indigo-600 p-12 lg:p-20 text-white">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-4 py-1.5 bg-indigo-500/50 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
            Penelitian PT. Pelindo Regional Cirebon
          </span>
          <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
            Pengamanan Keaslian Dokumen Bill of Lading
          </h1>
          <p className="text-xl lg:text-2xl text-indigo-100 font-medium leading-relaxed mb-10 opacity-90 italic">
            "Menggunakan Kriptografi Kunci Publik Elliptic Curve (ECC) & Digital
            Signature ECDSA"
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/upload"
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:bg-zinc-100 transition-all shadow-xl shadow-indigo-900/20"
            >
              Mulai Tanda Tangan
            </Link>
            <button
              onClick={generateKeys}
              disabled={loading}
              className="px-8 py-4 bg-indigo-500/30 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500/50 transition-all"
            >
              {loading ? "Memproses..." : "Buat Kunci ECC"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Standar ECC</h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Implementasi kurva SECP256K1 yang aman dan efisien untuk integritas
            data.
          </p>
        </div>
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Nir-Sangkalan</h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Menjamin pengirim tidak dapat menyangkal dokumen yang telah
            ditandatangani.
          </p>
        </div>
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Integritas Data</h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Setiap perubahan kecil pada dokumen akan membatalkan tanda tangan
            digital.
          </p>
        </div>
      </div>

      {status && (
        <div className="p-6 bg-zinc-900 text-white rounded-2xl font-mono text-sm overflow-x-auto">
          <p className="text-zinc-500 mb-2">// Respon Server:</p>
          <pre>{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
