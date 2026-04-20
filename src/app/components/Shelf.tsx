"use client";
import { motion } from "framer-motion";
import { ShelfProps, GoogleBook} from "@/app/types";
import { useBookshelf } from "@/app/context/BookshelfContext";
import { useState } from "react";

import BookDetailsModal from "./BookDetailsModal";

// Colores para lomos sin portada
const SPINE_COLORS = [
  "#8B4513",
  "#2F4F4F",
  "#4A3728",
  "#1C3A4A",
  "#5C3317",
  "#2D4A1E",
  "#4A1C3A",
  "#3A3A1C",
];

function getSpineColor(title: string) {
  const index = title.charCodeAt(0) % SPINE_COLORS.length;
  return SPINE_COLORS[index];
}

export default function Shelf({ title }: ShelfProps) {
  const { shelves } = useBookshelf();
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const books = shelves[title];

  const verticalBooks = books.filter((b) => b.orientation === "vertical");
  const horizontalBooks = books.filter((b) => b.orientation === "horizontal");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full mb-12"
    >
      {/* Título */}
      <div className="flex items-center mb-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-stone-500 mr-4">
          {title}
        </span>
        <div className="h-[1px] flex-grow bg-stone-300" />
      </div>

    {/* Área de libros (Sin carteles, espacio libre a la derecha) */}
      <div className="h-36 w-full flex items-end justify-between px-4 mb-1">
        
        {/* Contenedor de Libros: Verticales primero, luego Horizontales */}
        <div className="flex items-end gap-1 sm:gap-1.5 max-w-[75%]">
          
          {/* 1. Libros Verticales (A la IZQUIERDA) */}
          <div className="flex items-end gap-1 sm:gap-1.5">
            {verticalBooks.map(({ book }, i) => {
              const thumbnail = book.volumeInfo.imageLinks?.thumbnail;
              const color = getSpineColor(book.volumeInfo.title);
              return (
                <motion.div
                  key={book.id + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                   onClick={() => setSelectedBook(book)}
                  className="relative flex-shrink-0 w-6 sm:w-8 h-20 sm:h-28 rounded-sm shadow-md border-l border-white/10 overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform group"
                >
                  {thumbnail ? (
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${thumbnail})` }}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: color }} />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-0.5 sm:p-1">
                    <span className="text-[6px] sm:text-[8px] text-white font-bold uppercase tracking-tighter [writing-mode:vertical-lr] rotate-180 truncate h-full">
                      {book.volumeInfo.title}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 2. Libros Horizontales (A la DERECHA de los verticales) */}
          {horizontalBooks.length > 0 && (
            <div className="flex flex-col-reverse gap-0.5 sm:gap-1 mb-1 items-start ml-1">
              {horizontalBooks.map(({ book }, i) => {
                const thumbnail = book.volumeInfo.imageLinks?.thumbnail;
                const color = getSpineColor(book.volumeInfo.title);
                return (
                  <motion.div
                    key={book.id + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedBook(book)}
                    className="relative flex-shrink-0 h-5 sm:h-7 rounded-sm shadow-md overflow-hidden cursor-pointer hover:translate-x-2 transition-transform group border-t border-white/10 w-[80px] sm:w-[112px]"
                  >
                    {thumbnail ? (
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${thumbnail})` }}>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: color }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center px-2">
                      <span className="text-[6px] sm:text-[7px] text-white font-bold uppercase tracking-widest truncate w-full text-center">
                        {book.volumeInfo.title}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. ESPACIO LIBRE (Invisible, para futuras decoraciones) */}
        <div className="w-20 sm:w-24 h-full flex-shrink-0" />
      </div>

      {/* Tabla del estante */}
      <div className="relative">
        <div className="h-4 w-full bg-[#D2B48C] rounded-sm shadow-md border-b border-black/10" />
        <div className="h-6 w-full bg-black/5 blur-md absolute -bottom-6 left-0" />
      </div>
      <BookDetailsModal 
        book={selectedBook} 
        category={title}
        onClose={() => setSelectedBook(null)} 
      />
    </motion.div>
  );
}

