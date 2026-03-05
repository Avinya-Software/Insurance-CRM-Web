import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface ComboBoxItem {
  label: string;
  value: string;
}

interface Props<T extends ComboBoxItem> {
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  items: T[];
  value?: string;
  placeholder?: string;
  onSelect: (item: T | null) => void;
  onCreate?: (searchText: string) => void;
  emptyText?: string;
  createText?: string;
}

const SearchableComboBox = <T extends ComboBoxItem>({
  label,
  required,
  error,
  disabled,
  items,
  value,
  placeholder = "Select",
  onSelect,
  onCreate,
  emptyText = "No results found",
  createText = "Add new item",
}: Props<T>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = items.find((i) => i.value === value);

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        ref={ref}
        className={`relative ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {/* INPUT */}
        <div className="relative">
          <input
            className={`w-full px-4 py-2.5 bg-white border rounded text-sm transition-all outline-none mt-2
            ${
              open
                ? "border-blue-400 focus:ring-4 focus:ring-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }
            ${error ? "border-red-500 ring-2 ring-red-50" : ""}
            ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
            `}
            placeholder={placeholder}
            value={open ? search : selected?.label || ""}
            disabled={disabled}
            onFocus={() => {
              if (disabled) return;
              setOpen(true);
              setSearch("");
            }}
            onChange={(e) => setSearch(e.target.value)}
            readOnly={!open && !!selected}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div
            className="
            absolute z-50 top-full left-0 mt-1 w-full bg-white 
              border border-slate-200 rounded-none shadow-lg
              max-h-56 overflow-y-auto
              scrollbar-thin
            "
          >
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.value}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                    ${
                      item.value === value
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-slate-500 text-center">
                <p>{emptyText}</p>

                {onCreate && search && (
                  <button
                    type="button"
                    className="mt-3 w-full border border-blue-200 rounded-none py-2 text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                    onClick={() => onCreate(search)}
                  >
                    + {createText}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
};

export default SearchableComboBox;