import type { ReactNode } from "react";

interface SectionHeaderProps {
  index?: string;
  title: string | ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ index, title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-10 sm:mb-12 ${className}`}>
      {index && (
        <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-vermilion" aria-hidden="true" />
          <span>{index}</span>
        </div>
      )}
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[40px] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base text-ink-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
