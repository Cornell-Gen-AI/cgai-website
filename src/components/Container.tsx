import { PropsWithChildren } from "react";

interface ContainerProps {
  className?: string;
}

export default function Container({ children, className }: PropsWithChildren<ContainerProps>) {
  return (
    <div className={["mx-auto max-w-7xl px-6 md:px-8", className].filter(Boolean).join(" ")}> 
      {children}
    </div>
  );
} 