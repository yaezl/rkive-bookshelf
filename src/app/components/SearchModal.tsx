"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { GoogleBook } from "@/app/types";
import AddBookModal from "@/app/components/AddBookModal";

// Caché simple en memoria (vive mientras la app está abierta)
const searchCache = new Map<string, GoogleBook[]>();

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);

  // Ref para cancelar el fetch anterior si el usuario sigue escribiendo
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchBooks = useCallback(async (searchQuery: string) => {
    // Mínimo 3 caracteres
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    // Revisar caché primero
    const cacheKey = searchQuery.toLowerCase().trim();
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey)!);
      return;
    }

    // Cancelar request anterior si todavía está en vuelo
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const url = `/api/books?q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      const books: GoogleBook[] = data.items || [];

      // Guardar en caché
      searchCache.set(cacheKey, books);
      setResults(books);
    } catch (err: unknown) {
      // AbortError es esperado, no es un error real
      if (err instanceof Error && err.name !== "AbortError") {
        setError("No se pudo conectar. Intentá de nuevo.");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose} // Cerrar al clickear el fondo
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()} // Evitar que el click llegue al fondo
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="font-bold text-stone-900 text-lg">
                Buscar Libros
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-stone-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Input */}
            <div className="p-4 bg-white">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Título o autor..."
                    className="w-full pl-10 pr-4 py-3 bg-stone-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#4A3728] text-stone-900 placeholder:text-stone-500 font-medium"
                    value={query}
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchBooks(query)}
                  />
                </div>
                <button
                  onClick={() => searchBooks(query)}
                  disabled={query.length < 3 || loading}
                  className="px-4 py-3 bg-[#4A3728] text-white text-sm font-semibold rounded-xl hover:bg-[#3a2a1e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Buscar"
                  )}
                </button>
              </div>
            </div>

            {/* Resultados */}
            <div className="max-h-[400px] overflow-y-auto p-2 bg-white">
              {error ? (
                <p className="text-center py-10 text-red-400 text-sm">
                  {error}
                </p>
              ) : results.length > 0 ? (
                results.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className="flex gap-4 p-3 hover:bg-stone-100 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-20 bg-stone-200 rounded shadow-sm overflow-hidden flex-shrink-0">
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
                      <h4 className="text-sm font-bold text-stone-900 line-clamp-2 group-hover:text-[#4A3728]">
                        {book.volumeInfo.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 font-medium">
                        {book.volumeInfo.authors?.join(", ") ||
                          "Autor desconocido"}
                      </p>
                    </div>
                  </div>
                ))
              ) : query.length >= 3 && !loading ? (
                <p className="text-center py-10 text-stone-500 text-sm italic">
                    Presiona BUSCAR para obtener resultados
                </p>
              ) : (
                <p className="text-center py-10 text-stone-400 text-sm">
                  Empieza a escribir para buscar...
                </p>
              )}
            </div>
            <AddBookModal
              book={selectedBook}
               onClose={() => setSelectedBook(null)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
