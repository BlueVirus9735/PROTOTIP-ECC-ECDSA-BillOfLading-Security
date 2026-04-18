"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (err) {
      setError("Kesalahan koneksi ke server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-emerald-900/10">
        <h1 className="text-3xl font-black text-emerald-600 mb-6 text-center">
          Login Portal RTT
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-black dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_kph"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-black dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 mt-6 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-zinc-500">
          Gunakan username: admin_kph, admin_phw, atau admin_kadep <br />{" "}
          Password: password
        </div>
      </div>
    </div>
  );
}
