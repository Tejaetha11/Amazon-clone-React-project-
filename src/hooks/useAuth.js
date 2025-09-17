import { useState, useEffect } from "react";

export function useAuth() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error parsing saved user data:", err);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8000/users?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (data.length === 1) {
        const userData = data[0];
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        window.location.href = "/";
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
    }

    setLoading(false);
  };

  // ✅ Signup function (with default address)
  const signup = async (user) => {
    setLoading(true);
    setError(null);

    try {
      const checkRes = await fetch(
        `http://localhost:8000/users?email=${user.email}`
      );
      const existing = await checkRes.json();

      if (existing.length > 0) {
        setError("User already exists");
      } else {
        const newUser = {
          ...user,
          address: {
            pincode: "",
            city: "",
          },
        };

        const res = await fetch("http://localhost:8000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (res.ok) {
          window.location.href = "/login";
        } else {
          setError("Signup failed");
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error");
    }

    setLoading(false);
  };

  // ✅ Update user (for saving new address)
  const updateUser = async (updatedUser) => {
    try {
      const res = await fetch(`http://localhost:8000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        console.error("Failed to update user");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  return {
    user,
    error,
    loading,
    login,
    signup,
    logout,
    updateUser, 
  };
}
