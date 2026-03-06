import { useEffect, useState } from "react";
import Pagination from "../components/leads/Pagination";
import { useMake } from "../hooks/Make/useMake";
import { useModel } from "../hooks/Model/useModel";
import MakeModelTable from "../components/MakeModel/MakeModelTable";
import MakeModelUpsertSheet from "../components/MakeModel/MakeModelUpsertSheet";

interface Props {
  type: number;
  title: string;
}

export default function MakeModelPage({ type, title }: Props) {

  const makeHook = type === 1 ? useMake() : undefined;
const modelHook = type === 2 ? useModel() : undefined;

const pageNumber = makeHook?.pageNumber ?? modelHook?.pageNumber ?? 1;
const setPageNumber =
  makeHook?.setPageNumber ?? modelHook?.setPageNumber;

const loading = makeHook?.loading ?? modelHook?.loading ?? false;

const getList = makeHook?.getList ?? modelHook?.getList;

const deleteMake = makeHook?.deleteMake;
const deleteModel = modelHook?.deleteModel;

  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [openSheet, setOpenSheet] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const pageSize = 10;

  /* ===== DATA LOADER ===== */

  const loadData = async (page = 1) => {

    if (!getList) return;

    const res = await getList(page, pageSize);

    if (res) {
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    }
  };

  /* ===== PAGE CHANGE EFFECT ===== */

  useEffect(() => {
    loadData(1);
  }, [type]);

  const handleAdd = () => {
    setSelected(null);
    setOpenSheet(true);
  };

  return (
    <>
      <div className="bg-white border rounded-lg">

        {/* HEADER */}
        <div className="px-6 py-5 border-b bg-gray-100">
          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-4xl font-serif font-semibold text-slate-900">
                {title}
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                {data.length} total records
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium"
              onClick={handleAdd}
            >
              + Add {title}
            </button>

          </div>
        </div>

        {/* TABLE */}
        <MakeModelTable
          data={data}
          loading={loading}
          type={type}

          onEdit={(row) => {
            setSelected(row);
            setOpenSheet(true);
          }}

          onDeleteSuccess={() => loadData(pageNumber)}

          onDeleteMake={makeHook?.deleteMake}
          onDeleteModel={modelHook?.deleteModel}
        />

        {/* PAGINATION */}
        <div className="p-4 flex justify-end">
          <Pagination
            page={pageNumber}
            totalPages={totalPages}
            onChange={(p) => {
              setPageNumber(p);
              loadData(p);
            }}
          />
        </div>

      </div>

      {/* SHEET */}
      <MakeModelUpsertSheet
        open={openSheet}
        agency={selected}
        type={type}
        onClose={() => setOpenSheet(false)}
        onSuccess={() => loadData(pageNumber)}
      />
    </>
  );
}