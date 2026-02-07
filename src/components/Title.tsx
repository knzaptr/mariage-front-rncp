import { JSX, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const styles = {
  1: "text-[75px] md:text-[96px] jacques-francois-shadow-regular px-5",
  2: "text-6xl font-bold jacques-francois-shadow-regular red",
  3: "text-2xl font-semibold",
  4: "text-xl font-medium",
  5: "text-lg font-medium",
  6: "text-base font-normal",
};

const Title = ({
  level,
  children,
  className,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={twMerge(`${styles[level]} ${className}`)}>{children}</Tag>
  );
};

export default Title;
