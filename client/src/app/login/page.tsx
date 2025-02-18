"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
//import { AuthService } from "../../utils/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    //   await AuthService.signIn(email, password);
    //   router.push("/dashboard");
    // } catch (error) {
    //   console.error("Failed to login:", error);
    // }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <header className="w-full flex justify-between items-center p-6">
        <div className="text-2xl font-bold">A&A</div>
        <div>
          <Link href="/register">
            <span className="mr-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-200 cursor-pointer">
              Register
            </span>
          </Link>
          <Link href="/">
            <span className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-200 cursor-pointer">
              Home
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md text-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </main>
      <footer className="w-full text-center p-4">
        <p>&copy; 2025 A&A School. All rights reserved.</p>
      </footer>
    </div>
  );
}
