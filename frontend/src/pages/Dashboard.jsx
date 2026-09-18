import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import dashboardService from "../services/dashboardService";
import authService from "../services/authService";
import clientService from "../services/clientService";

import ClientTable from "../components/ClientTable";
import ClientFormModal from "../components/ClientFormModal";
import ClientDetailsModal from "../components/ClientDetailsModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import CategoryDistributionChart from "../components/CategoryDistributionChart";

import { formatNetWorth } from "../utils/formatters";

function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loadingClient, setLoadingClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getInsights();
        setInsights(data);
      } catch (error) {
        if (error.status == 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [refreshKey]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEditClient = (client) => {
    setSelectedClient(null);
    setEditingClient(client);
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(null);
    setDeletingClient(client);
  };

  const handleClientClick = async (client) => {
    setLoadingClient(true);

    try {
      const data = await clientService.getClientById(client._id);
      setSelectedClient(data.client);
    } catch (error) {
      console.error("Failed to fetch client:", error);
    } finally {
      setLoadingClient(false);
    }
  };

  const handleDeleteClient = async () => {
    setDeleteLoading(true);

    try {
      await clientService.deleteClient(deletingClient._id);

      setDeletingClient(null);
      setSelectedClient(null);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-slate-100">
      <nav className="top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
              <span className="text-sm font-bold text-white">CI</span>
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Client Insights
              </h1>

              <p className="text-xs text-slate-500">Wealth Advisor Dashboard</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3H9.75m0 0 3-3m-3 3 3 3"
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            A quick view of your client portfolio and wealth distribution.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="flex flex-1 flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Clients
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                {insights.totalClients}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Active clients in your portfolio
              </p>
            </div>

            <div className="flex flex-1 flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Aggregate Net Worth
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {formatNetWorth(insights.aggregateNetWorth)}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Combined portfolio value
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Client Distribution
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Distribution across HNI and UHNI categories
            </p>

            <CategoryDistributionChart
              distribution={insights.categoryDistribution}
            />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Clients</h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage and review your client portfolio
              </p>
            </div>

            <button
              onClick={() => setShowAddClient(true)}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
            >
              + Add Client
            </button>
          </div>
          <ClientTable
            onClientClick={handleClientClick}
            refreshKey={refreshKey}
          />
        </div>
      </main>

      {showAddClient && (
        <ClientFormModal
          onClose={() => setShowAddClient(false)}
          onSuccess={() => {
            setShowAddClient(false);
            setRefreshKey((current) => current + 1);
          }}
        />
      )}

      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={() => handleEditClient(selectedClient)}
          onDelete={() => handleDeleteClick(selectedClient)}
        />
      )}

      {editingClient && (
        <ClientFormModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSuccess={() => {
            setEditingClient(null);
            setSelectedClient(null);
            setRefreshKey((current) => current + 1);
          }}
        />
      )}

      {deletingClient && (
        <DeleteConfirmModal
          client={deletingClient}
          loading={deleteLoading}
          onClose={() => setDeletingClient(null)}
          onConfirm={handleDeleteClient}
        />
      )}

      {loadingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="rounded-lg bg-white px-5 py-3 text-sm shadow-lg">
            Loading client...
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
