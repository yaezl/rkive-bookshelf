"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Shelf from "@/app/components/Shelf";
import SearchModal from "@/app/components/SearchModal";

export default function BookshelfPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen p-8 md:p-16 flex flex-col items-center justify-start">
      
      {/* HEADER */}
      <header className="flex justify-between items-center w-full max-w-4xl mb-10">
        <h1 className="text-4xl font-serif font-bold text-[#4A3728] tracking-wide">
          Bookshelf Digital 
        </h1>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg bg-stone-200/50 hover:bg-stone-300 transition-colors shadow-sm" >
            <Search className="w-5 h-5 text-[#4A3728]" />
          </button>

          <button className="p-2 rounded-lg bg-stone-200/50 hover:bg-stone-300 transition-colors shadow-sm">
            <Plus className="w-5 h-5 text-[#4A3728]" /> {/* boton + para figurar */}
          </button>
        </div>
      </header>

      {/* LIBRERO */}
      <div
        className="
        relative w-full max-w-3xl p-6 md:p-10
        rounded-t-[160px] 
        border-[8px] border-[#4a2f14]
        shadow-[0_20px_60px_rgba(0,0,0,0.4)]
        madera-textura
        "
      >

        {/* BORDE INTERIOR */}
        <div
          className="
          rounded-t-[140px] 
          p-6 md:p-10 
          fondo-estante-oscuro
          border-[4px] border-[#3a2412]
          shadow-inner
          "
        >

          {/* SECCIÓN ESTANTES */}
          <section className="flex flex-col gap-10">
            <Shelf title="CURRENTLY READING" />
            <Shelf title="FAVORITES" />
            <Shelf title="TO READ" />
          </section>
        </div>

        {/* TEXTO SUPERIOR */}
        <div className="absolute top-2 left-0 w-full text-center text-[#E6C27A] font-serif tracking-widest text-lg">
          RKIVE
        </div>
      </div>

      {/* MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </main>
  );
}