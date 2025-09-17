// src/pages/Orders/OrderDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks";

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Try fetching directly by ID
    fetch(`http://localhost:8000/orders/${id}`)
      .then((r) => {
        if (r.ok) return r.json();
        // If direct fetch fails, fallback to query search
        return fetch(`http://localhost:8000/orders?id=${id}`).then((res) =>
          res.json()
        );
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrder(data[0] || null);
        } else {
          setOrder(data);
        }
      })
      .catch(() => setOrder(null));
  }, [id]);

  if (!order) {
    return <div className="max-w-3xl mx-auto p-6">Order not found.</div>;
  }

  // Buy It Again handler for first item
  const handleBuyAgain = () => {
    if (order.items && order.items.length > 0) {
      addToCart(order.items[0]);
      navigate("/checkout");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">{order.items[0]?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 border rounded">
          <div className="flex items-center gap-6">
            <img
              src={order.items[0]?.image}
              alt={order.items[0]?.name}
              className="w-32 h-32 object-contain"
            />
            <div>
              <h2 className="font-medium text-lg">{order.items[0]?.name}</h2>
              <p className="text-gray-600">
                ₹{order.items[0]?.price} × {order.items[0]?.quantity}
              </p>
              <Link
                to={`/products/${order.items[0]?.id}`}
                className="text-blue-600 text-sm mt-2 block"
              >
                View product details
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">How's your item?</h3>
            <button className="mt-2 px-4 py-2 border rounded text-sm">
              Write a product review
            </button>
          </div>
        </div>

        <div className="bg-white p-4 border rounded">
          <button 
            onClick={handleBuyAgain} 
            className="w-full bg-yellow-400 py-2 rounded mb-4 hover:bg-yellow-500 transition-colors"
          >
            Buy it again
          </button>
          <h3 className="font-semibold mb-2">Order info</h3>
          <p className="text-sm"><strong>Order ID:</strong> {order.id}</p>
          <p className="text-sm mt-1">
            Ordered on {new Date(order.date || Date.now()).toLocaleString()}
          </p>
          <p className="text-sm mt-2">
            <strong>Ship to:</strong> {order.address?.name || "Default User"}
          </p>
          <p className="text-sm">
            {order.address?.address || "Unknown"} - {order.address?.pincode || ""}
          </p>
        </div>
      </div>
    </div>
  );
};
