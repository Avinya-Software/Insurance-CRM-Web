import React from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className = "" }: SpinnerProps) => {
  return (
    <div
      className={`
        w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin
        ${className}
      `}
    />
  );
};

export default Spinner;