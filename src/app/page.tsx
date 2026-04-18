"use client";

import { useEffect, useState } from "react";
import DashboardLayout, { useAuth } from "../components/DashboardLayout";
import Link from "next/link";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FolderGit2, UserCheck, FileSignature, FileCheck, Trash2 } from "lucide-react";

// Helper for Mock Chart Data to make it look exactly like the reference UI
const rawMockData = [
  { name: 'Mar 6', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 8', Disahkan: 15, Review: 5, Kadep: 2, Draft: 20 },
  { name: 'Mar 10', Disahkan: 5, Review: 8, Kadep: 0, Draft: 5 },
  { name: 'Mar 12', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 14', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 16', Disahkan: 2, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 18', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 20', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 22', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 24', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 26', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 28', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Mar 30', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Apr 1', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
  { name: 'Apr 3', Disahkan: 0, Review: 0, Kadep: 0, Draft: 0 },
];

function DashboardContent() {
  const { user, token } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [trashCount, setTrashCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
    fetchTrashCount();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/docs_list.php");
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

  const fetchTrashCount = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/trash_list.php");
      const data = await res.json();
      if (data.status === "success") {
        setTrashCount(data.data.length);
      }
    } catch (e) {}
  };

  const handleVerifyPHW = async (docId: number) => {
    try {
      const res = await fetch("http://localhost:8000/api/update_status2.php", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: docId, token, status: "Menunggu Pengesahan Kadep" })
      });
      const data = await res.json();
      if (data.status === "success") fetchDocuments();
      else alert(data.message || "Terjadi kesalahan keamanan");
    } catch (e) { alert("Terjadi kesalahan."); }
  };

  const handleSignKadep = async (docId: number) => {
    try {
      alert("Proses Sign ECC Sedang Berjalan... Mohon tunggu");
      const res = await fetch("http://localhost:8000/api/sign2.php", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: docId, token })
      });
      const data = await res.json();
      if (data.status === "success") {
        alert("Selesai! File Signature digenerate: " + data.signature_file);
        fetchDocuments();
      } else alert("Pesan error: " + data.message);
    } catch (e) { alert("Terjadi kesalahan."); }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm("Bungkus dokumen ke tong sampah?")) return;
    try {
      const res = await fetch("http://localhost:8000/api/delete_doc.php", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: docId, token })
      });
      const data = await res.json();
      if (data.status === "success") { fetchDocuments(); fetchTrashCount(); }
      else alert(data.message);
    } catch (e) {}
  };

  // Metrics Logic
  const allDocs = documents.length;
  const draft = documents.filter(d => d.status === "Menunggu Review PHW").length;
  const kadepCount = documents.filter(d => d.status === "Menunggu Pengesahan Kadep").length;
  const disahkanCount = documents.filter(d => d.status === "Disahkan").length;

  return (
    <div className="space-y-6">
      {/* Top Filter Bar (Mock UI matches the requested design perfectly) */}
      <div className="flex gap-4">
        <select className="bg-[#1C1C1F] text-zinc-400 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none w-44">
          <option>Semua Dokumen</option>
          <option>Keamanan RTT</option>
        </select>
        <select className="bg-[#1C1C1F] text-zinc-400 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none w-44">
          <option>Harian</option>
          <option>Bulanan</option>
        </select>
        <button className="bg-[#1C1C1F] text-zinc-400 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-left w-56 flex items-center gap-2">
          <span>ðŸ“…</span> 3 April 2026
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Project / Drafts */}
        <div className="bg-[#1C1C1F] rounded-xl border border-[#2d5c8a] p-4 relative overflow-hidden group shadow-[0_0_20px_rgba(45,92,138,0.15)] flex flex-col justify-between h-28">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#2d5c8a]/20 blur-2xl rounded-full"></div>
           <div className="flex justify-between items-start relative z-10">
             <h3 className="text-zinc-100 font-bold text-sm tracking-wide">Total Draft</h3>
             <FolderGit2 className="text-zinc-500 w-5 h-5" />
           </div>
           <p className="text-3xl font-normal text-white relative z-10">{allDocs}</p>
        </div>
        
        {/* Review PHW */}
        <div className="bg-[#1C1C1F] rounded-xl border border-[#286043] p-4 relative overflow-hidden group shadow-[0_0_20px_rgba(40,96,67,0.15)] flex flex-col justify-between h-28">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#286043]/20 blur-2xl rounded-full"></div>
           <div className="flex justify-between items-start relative z-10">
             <h3 className="text-zinc-100 font-bold text-sm tracking-wide">Review PHW</h3>
             <UserCheck className="text-zinc-500 w-5 h-5" />
           </div>
           <p className="text-3xl font-normal text-white relative z-10">{draft}</p>
        </div>

        {/* Pengesahan Kadep */}
        <div className="bg-[#1C1C1F] rounded-xl border border-[#9b6a18] p-4 relative overflow-hidden group shadow-[0_0_20px_rgba(155,106,24,0.15)] flex flex-col justify-between h-28">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#9b6a18]/20 blur-2xl rounded-full"></div>
           <div className="flex justify-between items-start relative z-10">
             <h3 className="text-zinc-100 font-bold text-sm tracking-wide">Tunggu Kadep</h3>
             <FileSignature className="text-zinc-500 w-5 h-5" />
           </div>
           <p className="text-3xl font-normal text-white relative z-10">{kadepCount}</p>
        </div>

        {/* Alat Berat / Disahkan */}
        <div className="bg-[#1C1C1F] rounded-xl border border-[#6b2a8f] p-4 relative overflow-hidden group shadow-[0_0_20px_rgba(107,42,143,0.15)] flex flex-col justify-between h-28">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#6b2a8f]/20 blur-2xl rounded-full"></div>
           <div className="flex justify-between items-start relative z-10">
             <h3 className="text-zinc-100 font-bold text-sm tracking-wide">Dok. Disahkan</h3>
             <FileCheck className="text-zinc-500 w-5 h-5" />
           </div>
           <p className="text-3xl font-normal text-white relative z-10">{disahkanCount}</p>
        </div>

        {/* BBM / Terhapus */}
        <div className="bg-[#1C1C1F] rounded-xl border border-[#a12323] p-4 relative overflow-hidden group shadow-[0_0_20px_rgba(161,35,35,0.15)] flex flex-col justify-between h-28">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#a12323]/20 blur-2xl rounded-full"></div>
           <div className="flex justify-between items-start relative z-10">
             <h3 className="text-zinc-100 font-bold text-sm tracking-wide">Terhapus</h3>
             <Trash2 className="text-zinc-500 w-5 h-5" />
           </div>
           <div className="flex items-end gap-2 relative z-10">
             <p className="text-3xl font-normal text-white">{trashCount}</p>
             <p className="text-sm text-zinc-500 mb-1">Files</p>
           </div>
        </div>
      </div>

      {/* Chart System */}
      <div className="bg-[#1C1C1F] border border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-white font-bold tracking-wide">Grafik Data</h3>
            <p className="text-zinc-500 text-xs">Tampilkan pergerakan upload dan validasi dokumen</p>
          </div>
          <select className="bg-transparent border border-zinc-800 rounded-md text-xs px-3 py-1.5 text-zinc-400 outline-none">
            <option>1 bulan terakhir</option>
          </select>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rawMockData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDisahkan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorDraft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fill: '#52525b', fontSize: 11}} dy={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ fontSize: '13px' }}
              />
              <Area type="monotone" dataKey="Draft" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDraft)" strokeWidth={2} />
              <Area type="monotone" dataKey="Review" stroke="#eab308" fillOpacity={1} fill="url(#colorReview)" strokeWidth={2} />
              <Area type="monotone" dataKey="Disahkan" stroke="#10b981" fillOpacity={1} fill="url(#colorDisahkan)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-4">
           <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#eab308] rounded-full"></div><span className="text-[11px] text-zinc-400 font-medium">Review PHW</span></div>
           <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div><span className="text-[11px] text-zinc-400 font-medium">Selesai (Kadep)</span></div>
           <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full"></div><span className="text-[11px] text-zinc-400 font-medium">Proyek Draft Utama</span></div>
        </div>
      </div>

      {/* Integrated Data Table */}
      <div className="mt-6">
        <div className="bg-[#1A1A1D] border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#202024] border-b border-zinc-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Dokumen Registrasi</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Status Workflow</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {documents.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-600 text-sm">Tidak ada dokumen</td></tr>
              )}
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#202024] transition-colors group">
                  <td className="p-4 text-zinc-500 font-mono text-sm">#{doc.id}</td>
                  <td className="p-4">
                    <a href={`http://localhost:8000/api/download2.php?file=${doc.filename}`} target="_blank" rel="noreferrer" className="font-semibold text-zinc-300 hover:text-white transition-colors">
                      {doc.original_name}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide ${
                      doc.status === 'Disahkan' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 
                      doc.status === 'Menunggu Review PHW' ? 'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20' : 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                      {user.role === "phw" && doc.status === "Menunggu Review PHW" && (
                        <button onClick={() => handleVerifyPHW(doc.id)} className="px-3 py-1.5 bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/30 rounded text-xs font-bold hover:bg-[#eab308] hover:text-black transition-all">Verifikasi</button>
                      )}
                      {user.role === "kadep" && doc.status === "Menunggu Pengesahan Kadep" && (
                        <button onClick={() => handleSignKadep(doc.id)} className="px-3 py-1.5 bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30 rounded text-xs font-bold hover:bg-[#a855f7] hover:text-white transition-all">TTE (ECDSA)</button>
                      )}
                      {doc.status === "Disahkan" && (
                        <a href={`http://localhost:8000/api/download2.php?file=${doc.signature_path}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 rounded text-xs font-bold hover:bg-[#10b981] hover:text-black transition-all">.sig</a>
                      )}
                      <button onClick={() => handleDelete(doc.id)} className="px-2 py-1.5 text-zinc-600 hover:text-red-500 transition-colors" title="Hapus"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
