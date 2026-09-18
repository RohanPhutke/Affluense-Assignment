import { formatNetWorth, formatDate } from "../utils/formatters";

function ClientDetailsModal({ client, onClose, onEdit, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Client Details</h2>

            <p className="mt-1 text-sm text-slate-500">
              View client information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Name</p>
            <p className="mt-1 text-sm text-slate-900">{client.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {client.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Phone</p>
              <p className="mt-1 text-sm text-slate-900">
                {client.phone || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500">Net Worth</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatNetWorth(client.netWorth)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Category</p>
              <p className="mt-1 text-sm text-slate-900">{client.category}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Primary Asset Class
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {client.primaryAssetClass}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">Interests</p>
            <p className="mt-1 text-sm text-slate-900">
              {client.interests?.length ? client.interests.join(", ") : "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Onboarding Date
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {formatDate(client.onboardingDate)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>

          <button
            onClick={onEdit}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientDetailsModal;
