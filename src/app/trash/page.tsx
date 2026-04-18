"use client";

import { useEffect, useState } from "react";
import DashboardLayout, { useAuth } from "../../components/DashboardLayout";

function TrashContent() {
  const { token } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/trash_list.php");
      const data = await res.json();
      if (data.status === "success") {
        setDocuments(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (docId: number) => {
    try {
      const res = await fetch("http://localhost:8000/api/restore_doc.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: docId, token })
      });
      const data = await res.json();
      if (data.status === "success") {
        fetchTrash();
      } else {
        alert("Pesan error: " + data.message);
      }
    } catch (e) {
      alert("Terjadi kesalahan saat Memulihkan Dokumen.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Makam Dokumen (Tong Sampah)
        </h1>
        <p className="text-zinc-400 font-medium text-lg">
          Dokumen di sini dinonaktifkan dari dasbor utama tapi masih terekam di sistem.
        </p>
      </div>

      <div className="bg-[#1A1A1D] rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#202024] border-b border-zinc-800">
            <tr>
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">ID</th>
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Nama Dokumen</th>
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Waktu Terakhir</th>
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest text-right">Aksi Pulihkan</th>
            </tr>
          </thead>
          <tbody className="divide-y border-t-2 border-red-500 divide-zinc-800">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500 font-medium">
                  {loading ? "Memuat..." : "Yeay! Tong sampah Anda bersih mengkilap."}
                </td>
              </tr>
            ) : null}
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors">
                <td className="p-5 text-zinc-600 dark:text-zinc-400 font-mono text-sm">{doc.id}</td>
                <td className="p-5 font-medium text-zinc-400 dark:text-zinc-600 line-through">
                  {doc.original_name}
                </td>
                <td className="p-5 text-zinc-600 dark:text-zinc-400 text-sm font-medium">{doc.created_at}</td>
                <td className="p-5">
                  <button 
                    onClick={() => handleRestore(doc.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:scale-105 transition-all outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    Pulihkan Kembali
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TrashPage() {
  return (
    <DashboardLayout>
      <TrashContent />
    </DashboardLayout>
  );
}
