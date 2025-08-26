import { PropsWithChildren } from "react";

interface SectionProps {
  className?: string;
}

export default function Section({ children, className }: PropsWithChildren<SectionProps>) {
  return (
    <section className={["py-16 md:py-24", className].filter(Boolean).join(" ")}>{children}</section>
  );
} 