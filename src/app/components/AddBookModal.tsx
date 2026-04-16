"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, AlignHorizontalJustifyStart } from "lucide-react";
import { GoogleBook, ShelfCategory } from "@/app/types";
import { useBookshelf, BookOrientation } from "@/app/context/BookshelfContext";

const SHELVES: ShelfCategory[] = ["CURRENTLY READING", "FAVORITES", "TO READ"];

export default function AddBookModal({
  book,
  onClose,
}: {
  book: GoogleBook | null;
  onClose: () => void;
}) {
  const { addBook, canAdd } = useBookshelf();
  const [selectedShelf, setSelectedShelf] = useState<ShelfCategory | null>(null);
  const [selectedOrientation, setSelectedOrientation] = useState<BookOrientation | null>(null);

  const handleConfirm = () => {
    if (!book || !selectedShelf || !selectedOrientation) return;
    addBook(selectedShelf, book, selectedOrientation);
    onClose();
  };

  const isReady = selectedShelf && selectedOrientation;

  return (
    <AnimatePresence>
      {book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="font-bold text-stone-900 text-lg">Agregar a estantería</h2>
              <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Info del libro */}
            <div className="p-4 flex gap-4 border-b border-stone-100">
              <div className="w-12 h-16 bg-stone-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                    No cover
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-sm font-bold text-stone-900 line-clamp-2">
                  {book.volumeInfo.title}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  {book.volumeInfo.authors?.join(", ") || "Autor desconocido"}
                </p>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-5">
              {/* Elegir estantería */}
              <div>
                <p className="text-xs font-bold tracking-widest text-stone-500 mb-3">
                  ESTANTERÍA
                </p>
                <div className="flex flex-col gap-2">
                  {SHELVES.map((shelf) => {
                    const isFull = !canAdd(shelf, "vertical") && !canAdd(shelf, "horizontal");
                    return (
                      <button
                        key={shelf}
                        disabled={isFull}
                        onClick={() => {
                          setSelectedShelf(shelf);
                          setSelectedOrientation(null);
                        }}
                        className={`p-3 rounded-xl text-sm font-semibold text-left transition-all border-2
                          ${selectedShelf === shelf
                            ? "border-[#4A3728] bg-[#4A3728]/10 text-[#4A3728]"
                            : "border-stone-200 text-stone-600 hover:border-stone-300"
                          }
                          ${isFull ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                        `}
                      >
                        {shelf}
                        {isFull && <span className="ml-2 text-xs font-normal">(lleno)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Elegir orientación */}
              {selectedShelf && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-xs font-bold tracking-widest text-stone-500 mb-3">
                    POSICIÓN
                  </p>
                  <div className="flex gap-3">
                    {(["vertical", "horizontal"] as BookOrientation[]).map((orientation) => {
                      const available = canAdd(selectedShelf, orientation);
                      const count = orientation === "vertical"
                        ? `${5 - (available ? 0 : 5)} / 5`
                        : `${3 - (available ? 0 : 3)} / 3`;
                      return (
                        <button
                          key={orientation}
                          disabled={!available}
                          onClick={() => setSelectedOrientation(orientation)}
                          className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                            ${selectedOrientation === orientation
                              ? "border-[#4A3728] bg-[#4A3728]/10"
                              : "border-stone-200 hover:border-stone-300"
                            }
                            ${!available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                          `}
                        >
                          {orientation === "vertical"
                            ? <BookOpen className="w-5 h-5 text-[#4A3728]" />
                            : <AlignHorizontalJustifyStart className="w-5 h-5 text-[#4A3728]" />
                          }
                          <span className="text-xs font-semibold text-stone-700 capitalize">
                            {orientation === "vertical" ? "Vertical" : "Horizontal"}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {orientation === "vertical" ? "Máx 5" : "Máx 3"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Botón confirmar */}
              <button
                onClick={handleConfirm}
                disabled={!isReady}
                className="w-full py-3 bg-[#4A3728] text-white font-semibold rounded-xl hover:bg-[#3a2a1e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Agregar libro
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}