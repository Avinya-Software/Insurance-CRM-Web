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

  const makeHook = useMake();
  const modelHook = useModel();

  const hook = type === 1 ? makeHook : modelHook;

  const { pageNumber, setPageNumber, loading, getList, deleteMake, deleteModel } = {
    ...hook,
    ...makeHook,
    ...modelHook
  };

  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [openSheet, setOpenSheet] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const pageSize = 10;

  const loadData = async (page = pageNumber) => {

    const res = await getList(page, pageSize);

    if (res) {
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    }
  };

  // ✅ Single API call control
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

        <div className="px-6 py-5 border-b bg-gray-100 flex justify-between">

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

        <MakeModelTable
          data={data}
          loading={loading}
          type={type}

          onEdit={(row) => {
            setSelected(row);
            setOpenSheet(true);
          }}

          onDeleteMake={makeHook.deleteMake}
          onDeleteModel={modelHook.deleteModel}

          onDeleteSuccess={() => loadData()}
        />

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

      <MakeModelUpsertSheet
        open={openSheet}
        agency={selected}
        type={type}
        onClose={() => setOpenSheet(false)}
        onSuccess={() => loadData()}
      />
    </>
  );
}