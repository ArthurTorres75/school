"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/utils/auth";
import { Role } from "@/interfaces/auth.interface";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("register form: ", email, password, role);
    setIsLoading(true);
    await AuthService.signUp({ email, password, role })
      .then((response) => {
        console.log("Successfully registered:", response);
        router.push("/login");
        setEmail("");
        setPassword("");
        setRole(Role.STUDENT);
      })
      .catch((error) => {
        console.error("Failed to register:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <header className="w-full flex justify-between items-center p-6">
        <div className="text-2xl font-bold">A&A</div>
        <div>
          <Link href="/login">
            <span className="mr-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-200 cursor-pointer">
              Login
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
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e: any) => setRole(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="PARENT">Parent</option>
              <option value="WORKER">Worker</option>
              <option value="ADMIN">Admin</option>
              <option value="DIRECTOR">Director</option>
              <option value="SECRETARY">Secretary</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              Register
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
