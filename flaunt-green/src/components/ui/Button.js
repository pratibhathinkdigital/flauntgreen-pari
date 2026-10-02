import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className,
  onClick,
  type = "button",
  id,
  ...props
}) {
  const base = "btn";
  const variants = {
    primary:   "btn-primary",
    secondary: "btn-secondary",
    outline:   "btn-outline",
    ghost:     "btn-ghost",
    danger:    "btn-danger",
  };
  const sizes = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
