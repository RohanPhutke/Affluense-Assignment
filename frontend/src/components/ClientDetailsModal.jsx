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

        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          <div className="col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Name
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {client.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {client.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Phone
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {client.phone || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Net Worth
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {formatNetWorth(client.netWorth)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Category
            </p>

            <span className="mt-1 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold">
              {client.category}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Primary Asset Class
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {client.primaryAssetClass}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Onboarding Date
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {formatDate(client.onboardingDate)}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Interests
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {client.interests?.length ? client.interests.join(", ") : "-"}
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
