import { useState, useRef, useMemo } from "react";
import { MoreVertical } from "lucide-react";
import type { Product } from "../../interfaces/product.interface";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useInsurerDropdown } from "../../hooks/insurer/useInsurerDropdown";

const DROPDOWN_HEIGHT = 80;
const DROPDOWN_WIDTH = 180;

interface Props {
  data: Product[];
  onEdit: (product: Product) => void;
}

const ProductTable = ({ data = [], onEdit }: Props) => {
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [style, setStyle] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setOpenProduct(null));

  /* 🔥 INSURER DROPDOWN */
  const { data: insurers } = useInsurerDropdown();

  /* 🔥 BUILD ID → NAME MAP */
  const insurerMap = useMemo(() => {
    const map: Record<string, string> = {};
    insurers?.forEach((i) => {
      map[i.insurerId] = i.insurerName;
    });
    return map;
  }, [insurers]);

  const openDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setStyle({
      top: rect.bottom + 6,
      left: rect.right - DROPDOWN_WIDTH,
    });

    setOpenProduct(product);
  };

  const handleEdit = () => {
    if (!openProduct) return;
    onEdit(openProduct);
    setOpenProduct(null);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <Th>Product</Th>
            <Th>Code</Th>
            <Th>Category</Th>
            <Th>Insurer</Th>
            <Th>Status</Th>
            <Th className="text-center">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.productId} className="border-t h-[52px]">
              <Td>{p.productName}</Td>
              <Td>{p.productCode}</Td>
              <Td>{p.productCategory}</Td>

              {/* 🔥 ID → NAME MAPPING */}
              <Td>{insurerMap[p.insurerId] ?? "-"}</Td>

              <Td>{p.isActive ? "Active" : "Inactive"}</Td>

              <Td className="text-center">
                <button
                  onClick={(e) => openDropdown(e, p)}
                  className="p-2 rounded hover:bg-slate-200"
                >
                  <MoreVertical size={16} />
                </button>
              </Td>
            </tr>
          ))}

          {!data.length && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-slate-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {openProduct && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-[180px] bg-white border rounded shadow"
          style={style}
        >
          <MenuItem label="Edit Product" onClick={handleEdit} />
        </div>
      )}
    </div>
  );
};

export default ProductTable;

/* helpers */
const Th = ({ children }: any) => (
  <th className="px-4 py-3 text-left font-semibold">{children}</th>
);
const Td = ({ children }: any) => (
  <td className="px-4 py-3">{children}</td>
);
const MenuItem = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 hover:bg-slate-100"
  >
    {label}
  </button>
);
