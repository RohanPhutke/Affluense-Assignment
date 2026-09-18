import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8 || password.length > 72) {
      newErrors.password = "Password must be between 8 and 72 characters";
    }

    setErrors(newErrors);
    setLoginError("");

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await authService.login(email.trim(), password);
      navigate("/dashboard");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Client Insights</h1>
          <p className="mt-2 text-sm text-slate-500">
            Login to manage your clients
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${errors.email ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600"> {errors.email} </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${errors.password ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600"> {errors.password} </p>
            )}
          </div>
          {loginError && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? 
          <Link
            to="/sign-up"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            {" "}Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;