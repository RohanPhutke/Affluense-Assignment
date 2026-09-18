import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";
import authService from "../services/authService";

function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getInsights();
        setInsights(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const formatNetWorth = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
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
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-blue-900">Client Insights</h1>

            <p className="text-xs text-slate-500">Wealth Advisor Dashboard</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your client portfolio
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Clients</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {insights.totalClients}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">HNI / UHNI</p>

            <div className="mt-3 flex items-end gap-6">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {insights.categoryDistribution.HNI}
                </p>

                <p className="mt-1 text-xs text-slate-500">HNI</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {insights.categoryDistribution.UHNI}
                </p>

                <p className="mt-1 text-xs text-slate-500">UHNI</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Aggregate Net Worth
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {formatNetWorth(insights.aggregateNetWorth)}
            </p>
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

            <button className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              + Add Client
            </button>
          </div>

          <div className="mt-6 flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-300">
            <p className="text-sm text-slate-400">
              Client table here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
