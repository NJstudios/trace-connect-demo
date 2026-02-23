import React from "react";
import TopNav from "./TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-blueprint min-h-screen">
        <TopNav />
        <div className="mx-auto max-w-7xl px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
