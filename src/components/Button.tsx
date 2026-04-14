import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  className,
  onClick,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={twMerge(
        `w-full bg-wine text-white px-6 py-3 rounded hover:bg-wine-700 transition font-medium ${className}`,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
