import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, helpText, className, id, required, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={twMerge(clsx(error ? "input-error" : "input", className))}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
      {helpText && !error && <p className="text-xs text-text-muted mt-1">{helpText}</p>}
    </div>
  );
});

export default Input;
