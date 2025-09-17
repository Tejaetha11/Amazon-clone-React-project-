import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useCart } from "../../hooks";

export const OrdersPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("orders"); // "orders" | "returns"
  const [openReturn, setOpenReturn] = useState({}); // slider state for each item

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8000/orders?userId=${user.id}&_sort=date&_order=desc`)
        .then((r) => r.json())
        .then(setOrders)
        .catch(console.error);
    }
  }, [user]);

  // Handle slider toggle for returns
  const toggleReturn = (orderId, itemId) => {
    const key = `${orderId}_${itemId}`;
    setOpenReturn((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle marking an item as returned
  const handleReturn = async (order, item) => {
    // Update locally
    const updatedOrders = orders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            items: o.items.map((i) =>
              i.id === item.id ? { ...i, isReturned: true } : i
            ),
          }
        : o
    );
    setOrders(updatedOrders);

    // Update backend (PATCH)
    await fetch(`http://localhost:8000/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: updatedOrders.find((o) => o.id === order.id).items }),
    });
  };

  // Filtering orders for the current tab
  const getFilteredOrders = () =>
    orders
      .map((order) => ({
        ...order,
        items:
          tab === "orders"
            ? order.items.filter((item) => !item.isReturned)
            : order.items.filter((item) => item.isReturned),
      }))
      .filter((order) => order.items.length > 0);

  // Handle Buy It Again: add item to cart and redirect to checkout
  const handleBuyAgain = (item) => {
    addToCart(item);
    navigate("/checkout");
  };

  // Tab navigation UI
  const renderTabs = () => (
    <div className="flex border-b mb-6 text-lg">
      <button
        className={`mr-8 pb-2 font-semibold ${
          tab === "orders" ? "border-b-2 border-yellow-500 text-black" : "text-blue-700 hover:underline"
        }`}
        onClick={() => setTab("orders")}
      >
        Orders
      </button>
      <button
        className={`mr-8 pb-2 font-semibold ${
          tab === "returns" ? "border-b-2 border-yellow-500 text-black" : "text-blue-700 hover:underline"
        }`}
        onClick={() => setTab("returns")}
      >
        Returns
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-3">
        {tab === "returns" ? "Your Returns" : "Your Orders"}
      </h1>
      {renderTabs()}
      {getFilteredOrders().length === 0 ? (
        <p className="text-gray-600">
          {tab === "orders" ? "You have no orders yet." : "No returned items."}
        </p>
      ) : (
        <div className="space-y-6">
          {getFilteredOrders().map((order) => (
            <div key={order.id} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <div>
                  <p>
                    <span className="font-medium">ORDER PLACED:</span>{" "}
                    {new Date(order.date).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">TOTAL:</span> ₹{order.total}
                  </p>
                  <p>
                    <span className="font-medium">SHIP TO:</span> {order.address?.fullName || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">ORDER # {order.id}</p>
                  <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                    View order details
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {order.items.map((item) => {
                  const sliderKey = `${order.id}_${item.id}`;
                  return (
                    <div key={item.id} className="flex flex-col border-t pt-4">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                          <p className="font-semibold text-green-700">₹{item.price}</p>
                          <div className="mt-2 flex gap-2">
                            <button
                              className="px-3 py-1 bg-yellow-400 rounded text-sm"
                              onClick={() => handleBuyAgain(item)}
                            >
                              Buy it again
                            </button>
                            <Link
                              to={`/orders/${order.id}`}
                              className="px-3 py-1 border rounded text-sm"
                            >
                              View your item
                            </Link>
                            {tab === "orders" && !item.isReturned && (
                              <button
                                className="px-3 py-1 bg-gray-100 border text-sm"
                                onClick={() => toggleReturn(order.id, item.id)}
                              >
                                Return/Replace
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {openReturn[sliderKey] && tab === "orders" && !item.isReturned && (
                        <div className="mt-4 mb-2 p-4 border rounded bg-gray-50 animate-slide-down">
                          <h3 className="font-semibold mb-2 text-lg">Return/Replace Item</h3>
                          <p className="text-sm mb-2">Select reason for return:</p>
                          <select className="w-full mb-2 p-2 border rounded">
                            <option>Wrong item received</option>
                            <option>Product damaged/defective</option>
                            <option>Missing accessories</option>
                            <option>Other</option>
                          </select>
                          <textarea
                            className="w-full p-2 mb-2 border rounded"
                            rows={2}
                            placeholder="Additional details (optional)"
                          />
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            onClick={() => handleReturn(order, item)}
                          >
                            Submit Return Request
                          </button>
                        </div>
                      )}
                      {tab === "returns" && item.isReturned && (
                        <div className="mt-2 text-green-600 font-semibold">Returned</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
