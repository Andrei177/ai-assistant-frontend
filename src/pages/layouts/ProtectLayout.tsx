import { Navbar } from "@/widgets/navbar";
import { Outlet } from "react-router";

export const ProtectLayout = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <Outlet />
    </main>
  </div>
);
