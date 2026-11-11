import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string | ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-8 sm:mb-10 ${className}`}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9381E]/20 bg-[#FDEBEC] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-[#9F2F2D]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl lg:text-[40px] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base text-[#575653] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
