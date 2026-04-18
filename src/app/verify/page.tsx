"use client";

import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

function VerifyContent() {
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
      const response = await fetch("http://localhost:8000/api/verify.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center pt-8">
        <h1 className="text-4xl font-black text-white tracking-tight">Verifikasi Keaslian Kriptografi</h1>
        <p className="text-zinc-400 mt-3 text-lg font-medium">Bandingkan dokumen asli dengan tanda tangan digital ECDSA.</p>
      </div>

      <div className="bg-[#1C1C1F] p-8 rounded-xl shadow-sm border border-zinc-800">
        <form onSubmit={handleVerify} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-500 ml-2">1. Dokumen PDF Asli</label>
              <div className="relative border border-zinc-800 rounded-xl p-8 text-center hover:border-emerald-500 transition-all group bg-[#111111]">
                <input type="file" id="doc-upload" className="hidden" onChange={(e) => setDocFile(e.target.files?.[0] || null)} />
                <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <span className="text-sm font-bold text-zinc-300 break-all px-2">{docFile ? docFile.name : "+ Pilih PDF Asli"}</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-500 ml-2">2. Digital Signature (.sig)</label>
              <div className="relative border border-zinc-800 rounded-xl p-8 text-center hover:border-emerald-500 transition-all group bg-[#111111]">
                <input type="file" id="sig-upload" className="hidden" onChange={(e) => setSigFile(e.target.files?.[0] || null)} />
                <label htmlFor="sig-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 break-all px-2">{sigFile ? sigFile.name : "+ Pilih File .sig"}</span>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" disabled={!docFile || !sigFile || loading} className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-xl">
            {loading ? "Memverifikasi ECC ECDSA..." : "Jalankan Tes Keaslian Algoritma"}
          </button>
        </form>

        {result && (
          <div className={`mt-10 p-1 rounded-[2.5rem] animate-in zoom-in-95 duration-500 ${result.is_valid ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-200" : "bg-gradient-to-br from-rose-400 to-red-600 shadow-2xl shadow-rose-200"}`}>
            <div className="bg-white dark:bg-zinc-900 rounded-[2.3rem] p-10 text-center">
              <h3 className={`font-black text-5xl mb-4 tracking-tighter ${result.is_valid ? "text-emerald-600" : "text-rose-600"}`}>
                {result.is_valid ? "DOKUMEN ASLI / SESUAI" : "DOKUMEN PALSU!"}
              </h3>
              <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 max-w-xl mx-auto leading-tight mb-8">
                {result.is_valid ? "Integritas dokumen terbukti autentik." : "Isi dokumen tidak cocok dengan jejak digital kunci!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return <DashboardLayout><VerifyContent /></DashboardLayout>;
}
