"use client";
import { PropsWithChildren } from "react";

export interface TimelineItemData {
  icon: React.ReactNode;
  title: string;
  date: string;
}

interface TimelineProps {
  items: TimelineItemData[];
}

export default function Timeline({ items }: PropsWithChildren<TimelineProps>) {
  return (
    <div className="relative max-w-4xl">
      <ol className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-6">
        {items.map((item, index) => (
          <li
            key={index}
            className={`mb-12 ml-8 ${index === items.length - 1 ? '' : ''}`}
          >
            {/* Timeline dot with ring */}
            <span className="absolute flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff] rounded-full -start-5 ring-8 ring-white dark:ring-gray-900">
              <span className="text-white text-lg" aria-hidden>{item.icon}</span>
            </span>
            
            {/* Content */}
            <h3 className="mb-2 text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <time className="block mb-3 text-base md:text-lg font-normal leading-none text-gray-400 dark:text-gray-500">
              {item.date}
            </time>
          </li>
        ))}
      </ol>
    </div>
  );
} 