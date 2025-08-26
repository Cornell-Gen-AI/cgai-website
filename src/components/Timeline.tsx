"use client";
import { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface TimelineItemData {
  icon: React.ReactNode;
  title: string;
  date: string;
}

interface TimelineProps {
  items: TimelineItemData[];
}

export default function Timeline({ items }: PropsWithChildren<TimelineProps>) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <ol className="relative border-l border-white/10 pl-6 space-y-8">
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="ml-2"
        >
          <div className="absolute -left-3 top-1 h-6 w-6 rounded-full bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <span aria-hidden>{item.icon}</span>
          </div>
          <div className="rounded-2xl bg-white/5 backdrop-blur p-4 md:p-6 shadow-sm shadow-black/20">
            <h3 className="text-lg md:text-xl font-semibold text-zinc-100">{item.title}</h3>
            <p className="text-sm md:text-base text-zinc-400 mt-1">{item.date}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
} 