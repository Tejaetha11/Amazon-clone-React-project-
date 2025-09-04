import  { useState } from "react";
import { Link } from "react-router-dom";
import amazonLogoDark from "../../assets/amazon_logo_dark.png";
import { useAuth } from "../../hooks";
import { useEffect } from "react";

export const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
  };

  useEffect(() => {
  setForm({ email: "", password: "" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <div className="mt-8">
        <Link to="/">
          <img src={amazonLogoDark} alt="Amazon Logo" width={100} />
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded-lg p-8 w-[350px] shadow mt-12 flex flex-col"
      >
        <h1 className="text-2xl font-normal mb-4">Sign in</h1>

        <label htmlFor="email" className="text-sm mb-2 block">
          Email or mobile phone number
        </label>
        <input
          id="email"
          type="text"
          value={form.email}
          onChange={handleChange}
          autoComplete="off"
          className="w-full h-10 px-2 border border-gray-400 rounded mb-4 text-base focus:outline focus:outline-2 focus:outline-cyan-200"
        />

        <label htmlFor="password" className="text-sm mb-2 block">
          Password
        </label>
        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            autoComplete="off"
            className="w-full h-10 px-2 pr-12 border border-gray-400 rounded text-base focus:outline focus:outline-2 focus:outline-cyan-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-700 hover:underline text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-yellow-400 rounded hover:bg-yellow-500 transition-colors font-medium my-2 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-xs text-gray-700 mt-3 mb-2">
          By continuing, you agree to Amazon's{" "}
          <a href="#" className="text-blue-700 hover:underline">
            Conditions of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-700 hover:underline">
            Privacy Notice.
          </a>
        </p>
      </form>

      <div className="flex flex-col items-center w-full mt-8 mb-8">
        <div className="flex items-center w-[350px] text-gray-600 text-sm gap-2 mb-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span>New to Amazon?</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <a href="/signup" className="w-[350px]">
          <button className="w-full h-10 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Create your Amazon account
          </button>
        </a>
      </div>
      {/* Footer */}
      <footer className="w-full max-h-[200px] fixed bottom-0 bg-gradient-to-b from-gray-100 to-white border-t border-gray-200 text-xs">
        <div className="flex justify-center gap-8 py-5">
          <a href="#" className="text-blue-700 hover:underline">
            Conditions of Use
          </a>
          <a href="#" className="text-blue-700 hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="text-blue-700 hover:underline">
            Help
          </a>
        </div>
        <p className="text-center pb-4 text-gray-600">
          © 1996-2024, Amazon.com, Inc. or its affiliates
        </p>
      </footer>
    </div>
  );
};
