import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={twMerge(`border-b border-black w-4 h-4 ${className}`)}
    />
  );
};

export default Input;
