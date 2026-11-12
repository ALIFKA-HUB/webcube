import type { ReactNode } from "react";

interface SectionHeaderProps {
  badge?: string;
  index?: string;
  title: string | ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  badge,
  index,
  title,
  subtitle,
  className = "",
  align = "left",
}: SectionHeaderProps) {
  const isCenter = align === "center";
  const tag = badge || index;

  return (
    <div
      className={`mb-12 sm:mb-16 ${
        isCenter ? "text-center flex flex-col items-center" : ""
      } ${className}`}
    >
      {tag && (
        <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-well px-3 py-1 text-xs font-medium text-ink-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-vermilion" aria-hidden="true" />
          <span>{tag}</span>
        </div>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl text-sm sm:text-base text-ink-secondary leading-relaxed ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
