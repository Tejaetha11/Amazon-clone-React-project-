import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";

export const AddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    address: "",
    locality: "",
    city: "",
    state: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (user?.id) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/addresses?userId=${encodeURIComponent(user.id)}`
      );
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const userAddresses = await response.json();
      setAddresses(userAddresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setSaveStatus("Error loading addresses");
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: user?.name || "",
      phone: user?.phone || "",
      pincode: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      country: "India",
      addressType: "Home",
      isDefault: false,
    });
  };

  const handleAddAddress = () => {
    resetForm();
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEditAddress = (address) => {
    setFormData({ ...address });
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    const addressData = {
      ...formData,
      userId: user.id,
      id: editingId || Date.now(),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/addresses${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressData),
        }
      );
      if (!response.ok) throw new Error("Failed to save address");

      if (formData.isDefault) await setDefaultAddress(addressData.id);

      await fetchAddresses();
      setShowAddForm(false);
      setEditingId(null);
      resetForm();
      setSaveStatus(editingId ? "Address updated!" : "Address added!");
    } catch (error) {
      console.error("Error saving address:", error);
      setSaveStatus("Error saving address");
    }

    setTimeout(() => setSaveStatus(""), 3000);
  };

  const setDefaultAddress = async (addressId) => {
    try {
      for (const addr of addresses) {
        await fetch(`http://localhost:8000/addresses/${addr.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...addr, isDefault: addr.id === addressId }),
        });
      }
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setSaveStatus("Deleting...");
    try {
      const response = await fetch(`http://localhost:8000/addresses/${addressId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete address (status ${response.status})`);
      await fetchAddresses();
      setSaveStatus("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      setSaveStatus("Error deleting address");
    }
    setTimeout(() => setSaveStatus(""), 3000);
  };

  if (!user)
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl mb-4">Please sign in to manage addresses</h1>
        <Link
          to="/login"
          className="bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
        >
          Sign In
        </Link>
      </div>
    );

  if (loading) return <div className="max-w-4xl mx-auto p-6">Loading addresses...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Your addresses</h1>
        <p className="text-gray-600">Manage your delivery addresses</p>
      </div>

      {/* Status */}
      {saveStatus && (
        <div
          className={`mb-4 p-3 rounded ${
            saveStatus.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {saveStatus}
        </div>
      )}

      {/* Add new */}
      <div className="mb-6">
        <button
          onClick={handleAddAddress}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:border-gray-400 transition-colors"
        >
          <div className="text-2xl">+</div>
          <div>
            <h3 className="font-medium text-gray-700">Add a new address</h3>
            <p className="text-sm text-gray-500">Add a new delivery address</p>
          </div>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="border rounded-lg p-6 mb-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit address" : "Add a new address"}
          </h2>
          <form onSubmit={handleSaveAddress} className="space-y-4">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Pincode & Locality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locality *</label>
                <input
                  type="text"
                  value={formData.locality}
                  onChange={(e) => handleInputChange("locality", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="House/Building name, Road name, Area"
                required
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Country & Address Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="India">India</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <select
                  value={formData.addressType}
                  onChange={(e) => handleInputChange("addressType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                Set as default address
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-md font-medium"
              >
                {editingId ? "Update Address" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address list */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No addresses saved yet</p>
            <p className="text-sm">Add your first address to get started</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="border rounded-lg p-4 bg-white relative">
              {addr.isDefault && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Default
                </div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{addr.fullName}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {addr.addressType}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-1">
                    {addr.address}, {addr.locality}
                  </p>
                  <p className="text-gray-700 text-sm mb-1">
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p className="text-gray-700 text-sm mb-2">{addr.country}</p>
                  <p className="text-gray-600 text-sm">Phone number: {addr.phone}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => handleEditAddress(addr)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    Delete
                  </button>
                  {!addr.isDefault && (
                    <button
                      className="text-green-600 hover:underline text-sm"
                      onClick={() => setDefaultAddress(addr.id)}
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
