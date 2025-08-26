"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin } from "lucide-react";

interface MemberCardProps {
  name: string;
  role: string;
  imageSrc: string;
  linkedInUrl?: string;
}

export default function MemberCard({ name, role, imageSrc, linkedInUrl }: MemberCardProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={prefersReducedMotion ? {} : { y: -4 }}
      className="group rounded-2xl bg-white/5 backdrop-blur shadow-sm shadow-black/20 overflow-hidden"
    >
      <div className="relative aspect-[4/3]">
        <Image src={imageSrc} alt={`${name} headshot`} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
      </div>
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg md:text-xl font-semibold text-zinc-100 group-hover:text-white">{name}</h3>
          {linkedInUrl ? (
            <Link href={linkedInUrl} aria-label={`${name} LinkedIn`} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-xl p-1">
              <Linkedin className="h-5 w-5" />
            </Link>
          ) : null}
        </div>
        <p className="text-sm md:text-base text-zinc-400 mt-1">{role}</p>
      </div>
    </motion.article>
  );
} 