"use client";
import { motion } from "framer-motion";
import { ShelfProps } from "@/app/types";

export default function Shelf({ title }: ShelfProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full mb-12"
    >
      <div className="flex items-center mb-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-stone-500 mr-4">
          {title}
        </span>
        <div className="h-[1px] flex-grow bg-stone-300" />
      </div>

      <div className="h-32 w-full flex items-end px-4 mb-1">
        {/* Aquí irán los libros después */}
      </div>

      <div className="relative">
        <div className="h-4 w-full bg-[#D2B48C] rounded-sm shadow-md border-b border-black/10" />
        <div className="h-6 w-full bg-black/5 blur-md absolute -bottom-6 left-0" />
      </div>
    </motion.div>
  );
}