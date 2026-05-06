import React from "react";

interface ToggleProps {
  active?: boolean;
  onChange: () => void;
  loading?: boolean;
}

const Toggle = ({ active = false, onChange, loading = false }: ToggleProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!loading) onChange();
    }}
    disabled={loading}
    type="button"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus:outline-none ${
      active 
        ? "bg-blue-600 border-blue-600 shadow-sm" 
        : "bg-white border-blue-100 shadow-[0_0_8px_rgba(37,99,235,0.1)]"
    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm transition duration-200 ease-in-out ${
        active 
          ? "translate-x-5 bg-white" 
          : "translate-x-0 bg-slate-300"
      }`}
    />
  </button>
);

export default Toggle;
