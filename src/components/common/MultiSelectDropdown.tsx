import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface Item {
  label: string;
  value: string;
}

interface Props {
  items: Item[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown = ({
  items,
  selectedValues,
  onChange,
  placeholder = "Select items",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allSelected =
    items.length > 0 && selectedValues.length === items.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const filteredItems = useMemo(() => {
    return items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const toggleValue = (value: string) => {
    onChange(
      selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value]
    );
  };

  const removeValue = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  const toggleSelectAll = () => {
    onChange(allSelected ? [] : items.map((i) => i.value));
  };

  const selectedItems = items.filter((i) => selectedValues.includes(i.value));

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <div
        onClick={() => setOpen((p) => !p)}
        className={`min-h-[42px] w-full px-3 py-1 bg-white border rounded-lg cursor-pointer flex flex-wrap gap-2 items-center transition-all ${
          open ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {selectedItems.length === 0 ? (
          <span className="text-slate-400 text-sm">{placeholder}</span>
        ) : (
          selectedItems.map((item) => (
            <span
              key={item.value}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 group"
            >
              {item.label}
              <button
                onClick={(e) => removeValue(e, item.value)}
                className="hover:bg-blue-200 rounded-full transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
        <div className="ml-auto flex items-center gap-1 text-slate-400">
             {selectedValues.length > 0 && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onChange([]); }}
                    className="hover:text-red-500 transition-colors mr-1"
                >
                    <X size={14} />
                </button>
             )}
            <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-[100] mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search */}
          <div className="p-3 border-b bg-slate-50 flex items-center gap-3">
            <Search size={16} className="text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search segments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm bg-transparent outline-none text-slate-700"
            />
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {/* Select All */}
            {items.length > 0 && (
                <label className="flex items-center gap-3 px-4 py-3 border-b hover:bg-slate-50 text-sm cursor-pointer transition-colors font-medium text-slate-700">
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Select All</span>
                </label>
            )}

            {/* Items */}
            {filteredItems.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No segments found
              </div>
            )}

            <div className="py-1">
                {filteredItems.map((item) => (
                <label
                    key={item.value}
                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-sm cursor-pointer transition-colors ${
                        selectedValues.includes(item.value) ? "bg-blue-50 text-blue-700" : "text-slate-600"
                    }`}
                >
                    <input
                    type="checkbox"
                    checked={selectedValues.includes(item.value)}
                    onChange={() => toggleValue(item.value)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                </label>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
