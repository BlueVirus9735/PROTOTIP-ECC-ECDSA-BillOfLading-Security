"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout, { useAuth } from "../../components/DashboardLayout";

function UploadContent() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("document", file);
    formData.append("token", token); 

    try {
      const response = await fetch("http://localhost:8000/api/upload2.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      if (data.status === "success") {
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke backend.");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "kph") {
    return (
      <div className="p-12 text-center text-rose-600 bg-rose-50 rounded-3xl font-bold">
        Akses Ditolak: Hanya jabatan KPH yang diperbolehkan mengunggah dokumen baru!
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center pt-8">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Upload Dokumen Baru
        </h1>
        <p className="text-zinc-400 mt-3 text-lg font-medium">
          Keamanan Integritas Data (SHA-256) akan aktif saat file diunggah.
        </p>
      </div>

      <div className="bg-[#1C1C1F] p-10 rounded-xl shadow-sm border border-zinc-800">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="relative border-2 border-dashed border-zinc-700/50 rounded-xl p-16 text-center hover:border-emerald-500/50 transition-all group overflow-hidden bg-[#111111]">
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-emerald-200 shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <div>
                <span className="text-2xl font-black text-zinc-800 dark:text-zinc-200 block">
                  {file ? file.name : "Pilih Dokumen PDF"}
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 mt-2 block tracking-widest uppercase">
                  Format didukung: PDF
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="group relative w-full py-6 bg-emerald-600 text-white rounded-3xl font-extrabold text-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-200 dark:shadow-none overflow-hidden hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Mengenkripsi ECC (ECIES) & Mengunggah...
                </>
              ) : "Unggah Sekarang ke Server"}
            </span>
          </button>
        </form>

        {result && (
          <div
            className={`mt-10 p-6 rounded-3xl animate-in zoom-in-95 duration-500 ${result.status === "success" ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-300 border-emerald-100" : "bg-rose-50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300 border-rose-100"} border-2`}
          >
            <div className="flex items-center justify-center text-center gap-4">
              <div>
                <h3 className="font-black text-xl mb-1">
                  {result.status === "success" ? "Aman Terenkripsi ECC!" : "Gagal"}
                </h3>
                <p className="text-sm font-semibold opacity-80">
                  {result.message} {result.status === "success" && " Mengarahkan ke menu utama..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <DashboardLayout>
      <UploadContent />
    </DashboardLayout>
  );
}
