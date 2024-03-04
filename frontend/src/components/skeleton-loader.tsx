import { HTMLAttributes, ReactNode } from "preact/compat";

export interface SkeletonLoaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SkeletonLoader({ children, ...props }: SkeletonLoaderProps) {
  const { className = "" } = props;

  return (
    <div
      className={`
        animate-shine 
        bg-200% 
        bg-gradient-to-r from-slate-300 from-0% 
        via-slate-200 via-5% 
        to-slate-300 to-10%
        ${className}
        `}
    >
      {children}
    </div>
  );
}
