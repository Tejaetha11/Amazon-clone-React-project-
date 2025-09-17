import { useCart, useAuth } from "../../hooks";
import { Link, useNavigate } from "react-router-dom";

export const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Your Amazon Cart is empty</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Shop today’s deals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section - Cart Items */}
      <div className="lg:col-span-2 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <hr className="mb-4" />

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 border-b border-gray-200 pb-4 mb-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 object-contain"
            />
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">{item.name}</h2>
              <p className="text-gray-600">In stock</p>
              <p className="text-sm text-green-600">Eligible for FREE Shipping</p>
              <div className="flex items-center gap-4 mt-2">
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Qty: {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-lg font-semibold">₹{item.price * item.quantity}</div>
          </div>
        ))}
      </div>

      {/* Right Section - Subtotal and Proceed */}
      <div className="bg-white p-4 rounded shadow h-fit">
        <h2 className="text-lg font-medium mb-2">
          Subtotal ({cartItems.length} items):{" "}
          <span className="font-bold">₹{getCartTotal()}</span>
        </h2>
        <button
          onClick={handleProceed}
          className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 py-2 px-3 rounded font-semibold"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
};
