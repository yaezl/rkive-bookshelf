"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { GoogleBook, ShelfCategory } from "@/app/types";
import { useBookshelf } from "@/app/context/BookshelfContext";

interface BookDetailsModalProps {
  book: GoogleBook | null;
  category: ShelfCategory;
  onClose: () => void;
}
function getHighResImage(url: string): string {
  try {
    const hiRes = new URL(url.replace("http://", "https://"));
    hiRes.searchParams.set("zoom", "0");
    hiRes.searchParams.set("w", "800");
    hiRes.searchParams.delete("edge");
    return hiRes.toString();
  } catch {
    return url.replace("http://", "https://");
  }
}
export default function BookDetailsModal({ book, category, onClose }: BookDetailsModalProps) {
  const { removeBook } = useBookshelf();

  if (!book) return null;

  const handleRemove = () => {
    removeBook(category, book.id);
    onClose();
  };
  const imageUrl = book.volumeInfo.imageLinks?.thumbnail
    ? getHighResImage(book.volumeInfo.imageLinks.thumbnail)
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#F5F1E3] rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl border border-stone-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex flex-col md:flex-row">
            {/* Portada */}
            <div className="w-full md:w-1/2 bg-stone-200 aspect-[3/4] relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={book.volumeInfo.title}
                  className="w-full h-full object-cover shadow-lg"
                  style={{ imageRendering: "auto" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 italic">
                  Sin portada
                </div>
              )}
            </div>

            {/* Información */}
            <div className="p-8 flex flex-col justify-between flex-1">
              <div>
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-stone-200 transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
                
                <h2 className="text-2xl font-serif font-bold text-[#4A3728] leading-tight mb-2">
                  {book.volumeInfo.title}
                </h2>
                <p className="text-lg text-stone-600 mb-4">
                  {book.volumeInfo.authors?.join(", ") || "Autor desconocido"}
                </p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 bg-stone-200/50 px-2 py-1 rounded">
                  {category.replace("_", " ")}
                </span>
              </div>

              <button
                onClick={handleRemove}
                className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-100"
              >
                <Trash2 className="w-4 h-4" />
                Quitar de la estantería
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
