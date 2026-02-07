"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      // Note: Adjust the URL to your Laragon PHP path
      const response = await fetch("http://localhost/pelindo/api/sign.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke backend. Pastikan server PHP sudah menyala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Tanda Tangani Dokumen
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-lg">
          Amankan dokumen Bill of Lading kamu dengan Pasangan Kunci ECC.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="relative border-4 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 text-center hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-all group overflow-hidden">
            <div className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer flex flex-col items-center gap-5"
            >
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-indigo-200 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-zinc-800 dark:text-zinc-200 block">
                  {file ? file.name : "Pilih Dokumen Bill of Lading"}
                </span>
                <span className="text-sm text-zinc-400 mt-1 block">
                  Tarik dan lepas atau klik untuk mencari
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="group relative w-full py-5 bg-indigo-600 text-white rounded-2xl font-extrabold text-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-200 dark:shadow-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <span className="relative">
              {loading
                ? "Memproses Kriptografi..."
                : "Jalankan Tanda Tangan Digital"}
            </span>
          </button>
        </form>

        {result && (
          <div
            className={`mt-10 p-8 rounded-3xl animate-in zoom-in-95 duration-500 ${result.status === "success" ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/20" : "bg-rose-50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300 border-rose-100 dark:border-rose-900/20"} border-2`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${result.status === "success" ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-100" : "bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-100"}`}
              >
                {result.status === "success" ? "✓" : "✗"}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl mb-1">
                  {result.status === "success"
                    ? "Dokumen Berhasil Diamankan!"
                    : "Autentikasi Gagal"}
                </h3>
                <p className="text-base opacity-80 leading-relaxed font-medium">
                  {result.message}
                </p>

                {result.status === "success" && result.filename && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`http://localhost/pelindo/api/download.php?file=${result.filename}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Unduh PDF Ter-Tanda Tangan
                    </a>
                    <a
                      href={`http://localhost/pelindo/api/download.php?file=${result.signature_file}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Unduh Tanda Tangan (.sig)
                    </a>
                  </div>
                )}

                {result.status === "success" && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                    }}
                    className="mt-8 w-full py-3 border-2 border-dashed border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M3 21v-5h5" />
                    </svg>
                    Tanda Tangani Dokumen Lain
                  </button>
                )}

                {result.signature_path && (
                  <div className="mt-5 p-4 bg-white/80 dark:bg-black/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                    <p className="text-[10px] uppercase tracking-widest font-black text-emerald-600 dark:text-emerald-400 mb-2">
                      Lokasi File Tanda Tangan
                    </p>
                    <code className="text-xs break-all opacity-80 font-mono italic">
                      {result.signature_path}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
