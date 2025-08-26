import { PropsWithChildren } from "react";

export default function SectionHeading({ children }: PropsWithChildren) {
  return <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-zinc-100">{children}</h2>;
} 