import { cn } from "@/lib/cn";

/**
 * Hover previews the focus state at half strength: the border steps to Strike
 * but stays 1px, so nothing reflows until the field is actually focused. Focus
 * then does the documented hairline shift, 1px -> 2px with padding stepping
 * down to match.
 */
const SHELL =
  "w-full bg-paper border-hairline border-muted px-[16px] py-[12px] text-body text-ink transition-colors duration-200 ease-calm hover:border-strike focus:border-active focus:border-strike focus:px-[15px] focus:py-[11px] disabled:opacity-disabled disabled:hover:border-muted";

/** A Strike rule under the label, drawn while the field has focus. */
function LabelRule() {
  return (
    <span
      aria-hidden="true"
      className="mt-s-1 block h-px w-full origin-left scale-x-0 bg-strike transition-transform duration-[420ms] ease-calm group-focus-within:scale-x-100"
    />
  );
}

type Base = {
  id: string;
  label: string;
  helperText?: string;
  className?: string;
};

export function Input({
  id,
  label,
  helperText,
  className,
  ...rest
}: Base & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("group flex flex-col gap-s-2", className)}>
      <label htmlFor={id} className="font-sans text-ui text-ink transition-colors duration-200 ease-calm group-focus-within:text-strike">
        {label}
        <LabelRule />
      </label>
      <input
        id={id}
        className={SHELL}
        aria-describedby={helperText ? `${id}-help` : undefined}
        {...rest}
      />
      {helperText ? (
        <p id={`${id}-help`} className="text-body-sm text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export function Textarea({
  id,
  label,
  helperText,
  className,
  ...rest
}: Base & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn("group flex flex-col gap-s-2", className)}>
      <label htmlFor={id} className="font-sans text-ui text-ink transition-colors duration-200 ease-calm group-focus-within:text-strike">
        {label}
        <LabelRule />
      </label>
      <textarea
        id={id}
        className={cn(SHELL, "resize-y")}
        aria-describedby={helperText ? `${id}-help` : undefined}
        {...rest}
      />
      {helperText ? (
        <p id={`${id}-help`} className="text-body-sm text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
