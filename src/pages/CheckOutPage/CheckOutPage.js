import React, { useState, useEffect } from "react";
import { useCart, useAuth } from "../../hooks";
import { useNavigate, Link } from "react-router-dom";

export const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [showPopup, setShowPopup] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    upi: "",
    bank: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    if (user?.id) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [user, cartItems, navigate]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/addresses?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const userAddresses = await response.json();
      setAddresses(userAddresses);
      const defaultAddr = userAddresses.find(addr => addr.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : userAddresses.length > 0 ? userAddresses[0].id : null);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
    setLoading(false);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const response = await fetch(`http://localhost:8000/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Delete failed with status ${response.status}`);
      if (selectedAddressId === addressId) setSelectedAddressId(null);
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error deleting address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please sign in to place your order.");
      navigate('/login');
      return;
    }
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    const newOrder = {
      id: Date.now(),
      userId: user.id,
      date: new Date().toISOString(),
      total: getCartTotal(),
      status: "Placed",
      address: selectedAddress,
      paymentMethod: selectedPayment,
      items: cartItems
    };

    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });
      if (!response.ok) throw new Error('Failed to place order');
      clearCart();
      navigate("/success");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleConfirmPayment = () => {
    if (selectedPayment === "card") {
      if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
        alert("Please enter valid card details");
        return;
      }
    }
    if (selectedPayment === "upi") {
      if (!formData.upi.includes("@")) {
        alert("Please enter valid UPI ID");
        return;
      }
    }
    if (selectedPayment === "netbanking") {
      if (!formData.bank || formData.bank === "Select Bank") {
        alert("Please select your bank");
        return;
      }
    }
    setShowPopup(false);
    handlePlaceOrder();
  };

  if (loading) return <div className="max-w-6xl mx-auto p-6">Loading...</div>;

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="col-span-2 bg-white rounded shadow p-6">
          {!user && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-yellow-800">Sign in for better experience</h3>
                  <p className="text-sm text-yellow-600">Sign in to use saved addresses and faster checkout</p>
                </div>
                <Link to="/login" className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-medium">Sign In</Link>
              </div>
            </div>
          )}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Delivery address</h2>
            {!user ? (
              <p className="text-gray-700 mb-3">Please sign in to use saved addresses, or we'll use default address.</p>
            ) : addresses.length === 0 ? (
              <div className="border rounded-lg p-4 bg-yellow-50">
                <p className="text-gray-700 mb-3">No saved addresses found.</p>
                <Link to="/account/addresses" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-medium">Add New Address</Link>
              </div>
            ) : selectedAddress ? (
              <>
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">Delivering to {selectedAddress.fullName}</h3>
                        {selectedAddress.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{selectedAddress.address}, {selectedAddress.locality}</p>
                      <p className="text-sm text-gray-700">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                      <p className="text-sm text-gray-600">Phone: {selectedAddress.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <details className="group">
                    <summary className="text-blue-600 hover:underline cursor-pointer text-sm font-medium">Change delivery address</summary>
                    <div className="mt-3 space-y-3 border-t pt-3">
                      {addresses.map(addr => (
                        <label key={addr.id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 mr-3" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm">{addr.fullName}</h4>
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{addr.addressType}</span>
                                  {addr.isDefault && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>}
                                </div>
                                <p className="text-xs text-gray-700">{addr.address}, {addr.locality}</p>
                                <p className="text-xs text-gray-700">{addr.city}, {addr.state} {addr.pincode}</p>
                                <p className="text-xs text-gray-600">Phone: {addr.phone}</p>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <button onClick={e => { e.preventDefault(); e.stopPropagation(); handleDeleteAddress(addr.id); }} className="text-red-600 hover:text-red-800 text-xs px-2 py-1 hover:bg-red-50 rounded" title="Delete address">Delete</button>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>
                <div className="flex gap-3">
                  <Link to="/account/addresses" className="text-blue-600 hover:underline text-sm">+ Add new address</Link>
                  <Link to="/account/addresses" className="text-blue-600 hover:underline text-sm">Manage addresses</Link>
                </div>
              </>
            ) : null}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Payment method</h2>
            <div className="space-y-4">
              {[
                { id: "card", label: "Credit / Debit Card" },
                { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)" },
                { id: "netbanking", label: "Net Banking" },
                { id: "cod", label: "Cash on Delivery / Pay on Delivery" }
              ].map(method => (
                <label key={method.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" value={method.id} checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="h-4 w-4" />
                  <span className="text-gray-700">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="max-h-40 overflow-y-auto mb-4 border rounded p-2">
            {cartItems.length === 0 ? <p className="text-sm text-gray-600">No items in cart.</p> : cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-2">
                <span className="truncate w-2/3">{item.name}</span>
                <span>₹{item.price} × {item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mb-2">
            <span>Items ({cartItems.length}):</span>
            <span>₹{getCartTotal()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery:</span>
            <span className="text-green-600">Free</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Order Total:</span>
            <span className="text-red-600">₹{getCartTotal()}</span>
          </div>
          <button onClick={() => {
            if (user && !selectedAddressId) {
              alert("Please select a delivery address first");
              return;
            }
            if (selectedPayment === "cod") {
              handlePlaceOrder();
            } else {
              setShowPopup(true);
            }
          }} className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition-colors">
            Proceed to Pay
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            By placing your order, you agree to our privacy policy and terms of use.
          </p>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Enter {selectedPayment === "card" ? "Card Details" : selectedPayment === "upi" ? "UPI ID" : "Netbanking Info"}
            </h3>
            {selectedPayment === "card" && (
              <div className="space-y-3">
                <input type="text" placeholder="Card Number" value={formData.cardNumber} onChange={e => setFormData({ ...formData, cardNumber: e.target.value })} className="w-full border p-2 rounded" />
                <input type="text" placeholder="Expiry Date (MM/YY)" value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} className="w-full border p-2 rounded" />
                <input type="password" placeholder="CVV" value={formData.cvv} onChange={e => setFormData({ ...formData, cvv: e.target.value })} className="w-full border p-2 rounded" />
              </div>
            )}
            {selectedPayment === "upi" && (
              <input type="text" placeholder="Enter UPI ID (e.g., user@paytm)" value={formData.upi} onChange={e => setFormData({ ...formData, upi: e.target.value })} className="w-full border p-2 rounded" />
            )}
            {selectedPayment === "netbanking" && (
              <select value={formData.bank} onChange={e => setFormData({ ...formData, bank: e.target.value })} className="w-full border p-2 rounded">
                <option>Select Bank</option>
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Punjab National Bank</option>
              </select>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleConfirmPayment} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded font-semibold text-black">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
