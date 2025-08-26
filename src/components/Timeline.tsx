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
            className={`mb-12 ml-12 ${index === items.length - 1 ? '' : ''}`}
          >
            {/* Timeline dot with ring */}
            <span className={`absolute flex items-center justify-center w-12 h-12 rounded-full -start-6 ring-8 ring-white dark:ring-gray-900 ${
              index === 0 ? 'bg-blue-500' :
              index === 1 ? 'bg-green-500' :
              index === 2 ? 'bg-purple-500' :
              index === 3 ? 'bg-orange-500' :
              index === 4 ? 'bg-pink-500' :
              'bg-indigo-500'
            }`}>
              <span className="text-white text-2xl" aria-hidden>{item.icon}</span>
            </span>
            
            {/* Content */}
            <h3 className="mb-2 text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <time className="block mb-3 text-base md:text-lg font-normal leading-none text-gray-300 dark:text-gray-400">
              {item.date}
            </time>
          </li>
        ))}
      </ol>
    </div>
  );
} 