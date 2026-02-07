"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [docFile, setDocFile] = useState<File | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !sigFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("document", docFile);
    formData.append("signature", sigFile);

    try {
      const response = await fetch("http://localhost/pelindo/api/verify.php", {
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Verifikasi Keaslian
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-lg">
          Bandingkan dokumen dengan tanda tangan digitalnya menggunakan
          algoritma ECDSA.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
        <form onSubmit={handleVerify} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-2">
                1. Bill of Lading
              </label>
              <div className="relative border-2 border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 text-center hover:border-blue-200 transition-all group bg-zinc-50/50 dark:bg-black/20">
                <input
                  type="file"
                  id="doc-upload"
                  className="hidden"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="doc-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 break-all px-2">
                    {docFile ? docFile.name : "Pilih PDF Asli"}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-2">
                2. Digital Signature (.sig)
              </label>
              <div className="relative border-2 border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 text-center hover:border-violet-200 transition-all group bg-zinc-50/50 dark:bg-black/20">
                <input
                  type="file"
                  id="sig-upload"
                  className="hidden"
                  onChange={(e) => setSigFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="sig-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
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
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 break-all px-2">
                    {sigFile ? sigFile.name : "Pilih File .sig"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!docFile || !sigFile || loading}
            className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
          >
            {loading ? "Memverifikasi..." : "Jalankan Tes Keaslian"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-10 p-1 rounded-[2.5rem] animate-in zoom-in-95 duration-500 ${
              result.is_valid
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-200"
                : "bg-gradient-to-br from-rose-400 to-red-600 shadow-2xl shadow-rose-200"
            }`}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-[2.3rem] p-10 text-center">
              <div
                className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center text-6xl shadow-inner ${
                  result.is_valid
                    ? "bg-emerald-50 text-emerald-500"
                    : "bg-rose-50 text-rose-500"
                }`}
              >
                {result.is_valid ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>

              <h3
                className={`font-black text-5xl mb-4 tracking-tighter ${
                  result.is_valid ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {result.is_valid ? "DOKUMEN ASLI" : "DOKUMEN PALSU!"}
              </h3>

              <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 max-w-xl mx-auto leading-tight mb-8">
                {result.is_valid
                  ? "Verifikasi Berhasil: Dokumen ini terbukti autentik dan belum pernah diubah."
                  : "Verifikasi Gagal: Isi dokumen tidak sesuai dengan tanda tangan digitalnya!"}
              </p>

              <div
                className={`inline-block px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest ${
                  result.is_valid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {result.is_valid
                  ? "Status: Keaslian Terjamin"
                  : "Status: Integritas Terlanggar"}
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 mb-4">
                  LOG MESIN KRIPTOGRAFI
                </p>
                <code className="inline-block text-sm bg-zinc-50 dark:bg-black/40 px-6 py-3 rounded-2xl font-mono text-zinc-500 border border-zinc-100 dark:border-zinc-800">
                  {result.output}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
