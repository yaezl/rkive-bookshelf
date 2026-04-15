"use client";
import { Plus, Search } from "lucide-react";
import Shelf from "@/app/components/Shelf";

export default function BookshelfPage() {
  return (
    <main className="min-h-screen bg-[#F5F1E3] p-8 md:p-16">
      <header className="flex justify-between items-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl font-serif font-bold text-[#4A3728]">
          Rkive - bookshelf
        </h1>
        
        <div className="flex gap-4">
          <button className="p-2 rounded-lg bg-stone-200/50 hover:bg-stone-200 transition-colors">
            <Search className="w-5 h-5 text-[#4A3728]" />
          </button>
          <button className="p-2 rounded-lg bg-stone-200/50 hover:bg-stone-200 transition-colors">
            <Plus className="w-5 h-5 text-[#4A3728]" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-10 bg-[#EFEDE1] border border-stone-200 rounded-2xl shadow-inner">
        
        {/* Sección que contiene los estantes */}
        <section className="flex flex-col gap-10">
          <Shelf title="CURRENTLY READING" />
          <Shelf title="FAVORITES" />
          <Shelf title="TO READ" />
        </section>
      </div>
    </main>
  );
}