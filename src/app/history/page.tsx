"use client";

import { useEffect, useState } from "react";
import DashboardLayout, { useAuth } from "../../components/DashboardLayout";
import Link from "next/link";

function HistoryContent() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/docs_list.php",
      );
      const data = await response.json();
      if (data.status === "success") {
        setDocs(data.data);
      }
    } catch (error) {
      console.error("Error fetching docs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Riwayat Dokumen
          </h1>
          <p className="text-zinc-400 mt-3 text-lg">
            Daftar seluruh dokumen SKSHH & Hasil Hutan yang telah diamankan dengan Digital Signature.
          </p>
        </div>
      </div>

      <div className="bg-[#1A1A1D] rounded-xl border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-zinc-500">Memuat data...</p>
          </div>
        ) : docs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#202024] border-b border-zinc-800">
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Tanggal</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Nama Dokumen</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#202024] cursor-pointer transition-colors group">
                    <td className="p-4 text-sm font-medium text-zinc-500">{formatDate(doc.created_at)}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-200">{doc.original_name}</span>
                        <span className="text-xs text-zinc-500 font-mono mt-0.5">{doc.filename}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <a href={`http://localhost:8000/api/download2.php?file=${doc.filename}`} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all tooltip" title="Download PDF">PDF</a>
                        <a href={`http://localhost:8000/api/download2.php?file=${doc.filename}.sig`} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all" title="Download Signature">.SIG</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-zinc-500 font-bold">Belum ada dokumen</div>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return <DashboardLayout><HistoryContent /></DashboardLayout>;
}
