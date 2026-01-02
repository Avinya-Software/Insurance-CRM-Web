import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import InsurerTable from "../components/insurer/InsurerTable";
import InsurerUpsertSheet from "../components/insurer/InsurerUpsertSheet";
import ProductUpsertSheet from "../components/product/ProductUpsertSheet";
import { getInsurersApi } from "../api/insurer.api";
const Insurers = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openInsurerSheet, setOpenInsurerSheet] = useState(false);
    const [openProductSheet, setOpenProductSheet] = useState(false);
    const [selectedInsurer, setSelectedInsurer] = useState(null);
    /* ---------------- FETCH DATA ---------------- */
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getInsurersApi(pageNumber, pageSize, search);
            setData(res);
        }
        catch (error) {
            toast.error(error?.response?.data?.message ||
                "Failed to load insurers");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, [pageNumber, search]);
    /* ---------------- HANDLERS ---------------- */
    const handleAddInsurer = () => {
        setSelectedInsurer(null);
        setOpenInsurerSheet(true);
    };
    const handleEditInsurer = (insurer) => {
        setSelectedInsurer(insurer);
        setOpenInsurerSheet(true);
    };
    const handleAddProduct = (insurer) => {
        setSelectedInsurer(insurer);
        setOpenProductSheet(true);
    };
    // ✅ NO TOAST HERE
    const handleInsurerSuccess = () => {
        setOpenInsurerSheet(false);
        loadData();
    };
    // ✅ NO TOAST HERE
    const handleProductSuccess = () => {
        setOpenProductSheet(false);
        setSelectedInsurer(null);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { position: "top-right", reverseOrder: false }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "px-4 py-5 border-b bg-gray-100", children: _jsxs("div", { className: "grid grid-cols-2 gap-y-4 items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-serif font-semibold text-slate-900", children: "Insurers" }), _jsxs("p", { className: "mt-1 text-sm text-slate-600", children: [data?.totalRecords ?? 0, " total insurers"] })] }), _jsx("div", { className: "text-right", children: _jsx("button", { className: "inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium", onClick: handleAddInsurer, children: "+ Add Insurer" }) }), _jsx("div", { children: _jsx("input", { type: "text", placeholder: "Search insurer...", value: search, onChange: (e) => {
                                            setSearch(e.target.value);
                                            setPageNumber(1);
                                        }, className: "w-[360px] h-10 px-3 border rounded text-sm" }) }), _jsx("div", {})] }) }), _jsx(InsurerTable, { data: data?.data || [], onEdit: handleEditInsurer, onAddProduct: handleAddProduct }), _jsxs("div", { className: "flex justify-end gap-4 px-4 py-3 border-t text-sm", children: [_jsx("button", { disabled: pageNumber === 1, onClick: () => setPageNumber((p) => p - 1), className: "disabled:text-slate-400", children: "Prev" }), _jsxs("span", { children: ["Page ", pageNumber] }), _jsx("button", { disabled: pageNumber === data?.totalPages, onClick: () => setPageNumber((p) => p + 1), className: "disabled:text-slate-400", children: "Next" })] }), loading && (_jsx("div", { className: "px-4 py-2 text-sm text-slate-500", children: "Loading..." }))] }), _jsx(InsurerUpsertSheet, { open: openInsurerSheet, insurer: selectedInsurer, onClose: () => setOpenInsurerSheet(false), onSuccess: handleInsurerSuccess }), _jsx(ProductUpsertSheet, { open: openProductSheet, insurerId: selectedInsurer?.insurerId, onClose: () => {
                    setOpenProductSheet(false);
                    setSelectedInsurer(null);
                }, onSuccess: handleProductSuccess })] }));
};
export default Insurers;
