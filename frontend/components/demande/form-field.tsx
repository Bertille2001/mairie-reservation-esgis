import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const formInputClassName =
  "min-h-11 w-full rounded-lg border border-border/60 bg-surface-grouped px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

export const formSubsectionClassName =
  "space-y-4 rounded-lg border border-border/40 bg-surface-grouped/40 p-4 sm:p-5";

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="font-medium text-foreground text-sm">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-muted-foreground text-xs">{hint}</p>
      )}
      {error && (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  step?: number;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  step,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5",
        className,
      )}
    >
      <div className="mb-5 space-y-1">
        <div className="flex items-center gap-2.5">
          {step !== undefined && (
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 font-medium text-primary text-xs tabular-nums"
              aria-hidden
            >
              {step}
            </span>
          )}
          <h2 className="font-semibold text-base text-foreground tracking-[-0.01em]">
            {title}
          </h2>
        </div>
        {description && (
          <p className={cn("text-muted-foreground text-sm", step !== undefined && "pl-8.5")}>
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

interface FormSubsectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSubsection({ title, description, children }: FormSubsectionProps) {
  return (
    <div className={formSubsectionClassName}>
      <div className="space-y-0.5">
        <h3 className="font-medium text-foreground text-sm">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface SegmentedControlProps<T extends string> {
  name: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  "aria-describedby"?: string;
}

export function SegmentedControl<T extends string>({
  name,
  value,
  options,
  onChange,
  "aria-describedby": ariaDescribedBy,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      aria-describedby={ariaDescribedBy}
      className="rounded-lg bg-muted p-1"
    >
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-11 flex-col items-start rounded-md px-3 py-2.5 text-left transition-colors",
                selected
                  ? "bg-surface-elevated font-medium text-foreground shadow-xs ring-1 ring-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-sm">{option.label}</span>
              {option.hint && (
                <span className="mt-0.5 text-xs leading-snug opacity-80">{option.hint}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
