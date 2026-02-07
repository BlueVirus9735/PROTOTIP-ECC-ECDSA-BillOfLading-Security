import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
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
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-none">
            Pelindo Reg Cirebon
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            Autentikasi Dokumen
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 font-semibold">
        <Link
          href="/"
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Beranda
        </Link>
        <Link
          href="/history"
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Riwayat
        </Link>
        <Link
          href="/upload"
          className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          Tanda Tangan
        </Link>
        <Link
          href="/verify"
          className="text-sm px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
        >
          Verifikasi Keaslian
        </Link>
      </div>
    </nav>
  );
}
