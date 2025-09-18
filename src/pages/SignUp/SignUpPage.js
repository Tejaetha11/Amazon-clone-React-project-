import React, { useState } from "react";
import { Link } from "react-router-dom";
import amazonLogoDark from "../../assets/amazon_logo_dark.png";
import { useAuth } from "../../hooks";

export const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [formError, setFormError] = useState("");
  const { error, loading, signup } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) {
      setFormError("Please enter your name");
      return;
    }
    if (!form.email.trim()) {
      setFormError("Please enter your email or mobile number");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    setFormError(""); 
    signup(form);
  };

  return (
    <div className="min-h-screen bg-white pb-40 px-4">
      <div className="pt-5 text-center">
        <Link to="/">
          <img
            className="inline-block"
            src={amazonLogoDark}
            width="100"
            alt="Amazon Logo"
          />
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto mt-5 p-6 border border-gray-300 rounded-lg"
      >
        <h1 className="text-3xl font-normal mb-6">Sign up</h1>

        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Your name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="First and last name"
          className="w-full h-8 px-2 py-1 text-xs border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-1 mb-5"
        />

        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Mobile number or email
        </label>
        <input
          id="email"
          type="text"
          value={form.email}
          onChange={handleChange}
          className="w-full h-8 px-2 py-1 text-xs border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-1 mb-5"
        />

        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          className="w-full h-8 px-2 py-1 text-xs border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-1 mb-5"
        />

        {/* Show form validation error */}
        {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}
        {/* Display error from signup hook if any */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>

      <div className="max-w-sm mx-auto mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
        <hr className="w-28 border-0 h-px bg-gray-300" />
        <p>Have an account?</p>
        <hr className="w-28 border-0 h-px bg-gray-300" />
      </div>

      <div className="text-center mt-0 max-w-sm mx-auto">
        <a href="/login">
          <button className="w-full h-8 mt-6 text-xs bg-white hover:bg-gray-100 border border-gray-300 rounded cursor-pointer transition-colors">
            Login with Amazon account
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
          © 1996-2025, Amazon.com, Inc. or its affiliates
        </p>
      </footer>

    </div>
  );
};
