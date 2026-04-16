"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { ShelfCategory, GoogleBook } from "@/app/types";

export type BookOrientation = "vertical" | "horizontal";

export interface ShelfBook {
  book: GoogleBook;
  orientation: BookOrientation;
}

interface BookshelfState {
  shelves: Record<ShelfCategory, ShelfBook[]>;
  addBook: (category: ShelfCategory, book: GoogleBook, orientation: BookOrientation) => void;
  canAdd: (category: ShelfCategory, orientation: BookOrientation) => boolean;
}

const BookshelfContext = createContext<BookshelfState | null>(null);

export function BookshelfProvider({ children }: { children: ReactNode }) {
  const [shelves, setShelves] = useState<Record<ShelfCategory, ShelfBook[]>>({
    "CURRENTLY READING": [],
    "FAVORITES": [],
    "TO READ": [],
  });

  const canAdd = (category: ShelfCategory, orientation: BookOrientation) => {
    const shelf = shelves[category];
    const verticals = shelf.filter((b) => b.orientation === "vertical").length;
    const horizontals = shelf.filter((b) => b.orientation === "horizontal").length;
    if (orientation === "vertical") return verticals < 5;
    if (orientation === "horizontal") return horizontals < 3;
    return false;
  };

  const addBook = (category: ShelfCategory, book: GoogleBook, orientation: BookOrientation) => {
    if (!canAdd(category, orientation)) return;
    setShelves((prev) => ({
      ...prev,
      [category]: [...prev[category], { book, orientation }],
    }));
  };

  return (
    <BookshelfContext.Provider value={{ shelves, addBook, canAdd }}>
      {children}
    </BookshelfContext.Provider>
  );
}

export function useBookshelf() {
  const ctx = useContext(BookshelfContext);
  if (!ctx) throw new Error("useBookshelf debe usarse dentro de BookshelfProvider");
  return ctx;
}