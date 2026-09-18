import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";

import clientService from "../services/clientService";

const modules = [AllCommunityModule];

function ClientTable({ onClientClick, refreshKey }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("netWorth_desc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1.3,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.4,
        valueFormatter: (params) => params.value || "-",
      },
      {
        field: "phone",
        headerName: "Phone",
        flex: 1,
        valueFormatter: (params) => params.value || "-",
      },
      {
        field: "netWorth",
        headerName: "Net Worth",
        flex: 1,
        valueFormatter: (params) => {
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(params.value || 0);
        },
      },
      {
        field: "category",
        headerName: "Category",
        flex: 0.8,
      },
      {
        field: "primaryAssetClass",
        headerName: "Asset Class",
        flex: 1.2,
      },
      {
        field: "interests",
        headerName: "Interests",
        flex: 1.4,
        valueFormatter: (params) => {
          return params.value?.join(", ") || "-";
        },
      },
      {
        field: "onboardingDate",
        headerName: "Onboarded",
        flex: 1,
        valueFormatter: (params) => {
          if (!params.value) {
            return "-";
          }

          return new Date(params.value).toLocaleDateString("en-IN");
        },
      },
    ],
    [],
  );

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await clientService.getClients({
          search,
          category,
          sort,
          page,
          limit,
        });

        setClients(data.clients);
        setPagination(data.pagination);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [search, category, sort, page, limit, refreshKey]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  return (
    <div className="mt-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Search by client name..."
          value={search}
          onChange={handleSearchChange}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={category}
          onChange={handleCategoryChange}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="HNI">HNI</option>
          <option value="UHNI">UHNI</option>
        </select>

        <select
          value={sort}
          onChange={handleSortChange}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="netWorth_desc">Net Worth: High to Low</option>

          <option value="netWorth_asc">Net Worth: Low to High</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="h-[520px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">Loading clients...</p>
          </div>
        ) : (
          <AgGridReact
            modules={modules}
            rowData={clients}
            columnDefs={columnDefs}
            onRowClicked={(event) => onClientClick(event.data)}
            defaultColDef={{
              sortable: false,
              resizable: true,
            }}
            rowClass="cursor-pointer"
          />
        )}
      </div>

      {pagination && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {clients.length} of {pagination.total} clients
          </p>
          <div className="flex items-center gap-3">
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientTable;
