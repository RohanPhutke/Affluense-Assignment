import { useState } from "react";

import clientService from "../services/clientService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  netWorthAmount: "",
  netWorthUnit: "Million",
  category: "",
  primaryAssetClass: "",
  interests: "",
  onboardingDate: "",
};

function ClientFormModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const interests = form.interests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);

    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2 || name.length > 100) {
      newErrors.name = "Name must be between 2 and 100 characters";
    }

    if (!email && !phone) {
      newErrors.contact = "At least one of email or phone is required";
    }

    if (email && !email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (phone.length > 20) {
      newErrors.phone = "Phone number is too long";
    }

    const amount = Number(form.netWorthAmount);

    if (form.netWorthAmount === "" || !Number.isFinite(amount) || amount < 0) {
      newErrors.netWorth = "Enter a valid net worth";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (!form.primaryAssetClass.trim()) {
      newErrors.primaryAssetClass = "Primary asset class is required";
    }

    if (!form.onboardingDate) {
      newErrors.onboardingDate = "Onboarding date is required";
    }

    return {
      newErrors,
      interests,
    };
  };

  const convertNetWorth = () => {
    const amount = Number(form.netWorthAmount);

    const multipliers = {
      Thousand: 1000,
      Million: 1000000,
      Billion: 1000000000,
    };

    return amount * multipliers[form.netWorthUnit];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { newErrors, interests } = validate();

    setErrors(newErrors);
    setServerError("");

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const clientData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase() || undefined,
      phone: form.phone.trim() || undefined,
      netWorth: convertNetWorth(),
      category: form.category,
      primaryAssetClass: form.primaryAssetClass.trim(),
      interests,
      onboardingDate: form.onboardingDate,
    };

    setLoading(true);

    try {
      await clientService.createClient(clientData);

      onSuccess();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Client</h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new client to your portfolio
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Client full name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="client@email.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {errors.contact && (
            <p className="-mt-3 text-xs text-red-600">{errors.contact}</p>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Net Worth
            </label>

            <div className="grid grid-cols-[1fr_140px] gap-3">
              <input
                name="netWorthAmount"
                type="number"
                min="0"
                value={form.netWorthAmount}
                onChange={handleChange}
                placeholder="50"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                name="netWorthUnit"
                value={form.netWorthUnit}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="Thousand">Thousand</option>
                <option value="Million">Million</option>
                <option value="Billion">Billion</option>
              </select>
            </div>

            {errors.netWorth && (
              <p className="mt-1 text-xs text-red-600">{errors.netWorth}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select category</option>
              <option value="HNI">HNI</option>
              <option value="UHNI">UHNI</option>
            </select>

            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Primary Asset Class
            </label>

            <select
              name="primaryAssetClass"
              value={form.primaryAssetClass}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select asset class</option>
              <option value="Equity">Equity</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Startups">Startups</option>
              <option value="Alternatives">Alternatives</option>
            </select>

            {errors.primaryAssetClass && (
              <p className="mt-1 text-xs text-red-600">
                {errors.primaryAssetClass}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Interests
            </label>

            <input
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="AI, Fintech, Startups"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-400">
              Separate multiple interests with commas
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Onboarding Date
            </label>

            <input
              name="onboardingDate"
              type="date"
              value={form.onboardingDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />

            {errors.onboardingDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.onboardingDate}
              </p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientFormModal;
