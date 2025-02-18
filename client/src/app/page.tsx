import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <header className="w-full flex justify-between items-center p-6">
        <div className="text-2xl font-bold">A&A</div>
        <div>
          <Link href="/login">
            <span className="mr-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-200 cursor-pointer">
              Login
            </span>
          </Link>
          <Link href="/register">
            <span className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-200 cursor-pointer">
              Register
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-6xl font-extrabold">School</h1>
      </main>
      <footer className="w-full text-center p-4">
        {/* <p>&copy; 2025 A&A School. All rights reserved.</p> */}
      </footer>
    </div>
  );
}
