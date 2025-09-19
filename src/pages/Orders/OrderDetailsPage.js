// src/pages/Orders/OrderDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart, useAuth } from "../../hooks";
import { API_BASE_URL } from "../../Config/api";

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  
  // Review modal states
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    verified: true
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders/${id}`)
      .then((r) => {
        if (r.ok) return r.json();
        return fetch(`${API_BASE_URL}/orders?id=${id}`).then((res) => res.json());
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

  // Simple tracking data - all orders show as "Shipped" for demonstration
  const getTrackingInfo = () => {
    const orderDate = new Date(order.date || Date.now());
    const orderIdNum = parseInt(order.id) || 1;
    
    // All orders show as "Shipped" status
    const currentStatus = 'shipped';
    const estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    
    const steps = [
      {
        status: 'ordered',
        title: 'Order Placed',
        description: 'Your order has been placed successfully',
        date: orderDate.toISOString(),
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        date: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        completed: true
      },
      {
        status: 'shipped',
        title: 'Shipped',
        description: 'Your package has been shipped and is on the way',
        date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        current: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Your package will be out for delivery',
        date: null,
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package will be delivered to your address',
        date: null,
        completed: false
      }
    ];

    const trackingNumber = `AMZ${orderIdNum.toString().padStart(14, '0')}`;
    const carriers = ['Amazon Logistics', 'Blue Dart', 'DTDC', 'Delhivery', 'Ekart'];
    const carrier = carriers[orderIdNum % carriers.length];

    return {
      trackingNumber,
      carrier,
      estimatedDelivery,
      currentStatus,
      steps
    };
  };

  if (!order) {
    return <div className="max-w-3xl mx-auto p-6">Order not found.</div>;
  }

  const handleBuyAgain = () => {
    if (order.items && order.items.length > 0) {
      addToCart(order.items[0]);
      navigate("/checkout");
    }
  };

  const handleWriteReview = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowWriteReview(true);
  };

  const submitReview = async () => {
    if (!user || !newReview.title.trim() || !newReview.comment.trim()) return;

    setSubmittingReview(true);
    try {
      const reviewData = {
        ...newReview,
        userId: user.id,
        productId: order.items[0].id,
        userName: user.name || user.email,
        date: new Date().toISOString(),
        helpful: 0,
        verified: true
      };

      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        setReviewSubmitted(true);
        setNewReview({ rating: 5, title: '', comment: '', verified: true });
        setShowWriteReview(false);
        setTimeout(() => setReviewSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
    setSubmittingReview(false);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`text-2xl ${
              interactive ? 'hover:text-yellow-400 cursor-pointer' : ''
            } ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const TrackingModal = ({ tracking, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Track your package</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Delivery estimate */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📦</span>
                </div>
                <span className="font-semibold text-green-800">
                  Arriving {new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-8">
                By {new Date(tracking.estimatedDelivery).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </p>
            </div>

            {/* Product info */}
            <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg">
              <img
                src={order.items[0]?.image}
                alt={order.items[0]?.name}
                className="w-20 h-20 object-contain"
              />
              <div>
                <h3 className="font-medium">{order.items[0]?.name}</h3>
                <p className="text-sm text-gray-600">Qty: {order.items[0]?.quantity}</p>
                <p className="text-sm font-medium text-green-600 mt-1">
                  {tracking.carrier} • {tracking.trackingNumber}
                </p>
              </div>
            </div>

            {/* Progress tracker */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Package progress</h3>
              <div className="relative">
                {tracking.steps.map((step, index) => (
                  <div key={step.status} className="relative flex items-start mb-8 last:mb-0">
                    {/* Connection line */}
                    {index < tracking.steps.length - 1 && (
                      <div 
                        className={`absolute left-4 top-8 w-0.5 h-16 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                    
                    {/* Status circle */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.completed 
                        ? 'bg-green-500 border-green-500' 
                        : step.current 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-white border-gray-300'
                    }`}>
                      {step.completed ? (
                        <span className="text-white text-sm">✓</span>
                      ) : step.current ? (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      )}
                    </div>

                    {/* Status info */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${
                          step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h4>
                        {step.date && (
                          <span className="text-sm text-gray-500">
                            {new Date(step.date).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      
                      {step.current && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                          Your package is currently out for delivery and will arrive today.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Delivery address</h3>
              <div className="text-sm text-gray-600">
                <p><strong>{order.address?.name || "Default User"}</strong></p>
                <p>{order.address?.address || "123 Main Street"}</p>
                <p>{order.address?.city || "City"}, {order.address?.state || "State"} {order.address?.pincode || "123456"}</p>
              </div>
            </div>

            {/* Contact delivery partner */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                Contact carrier
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Get delivery updates
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tracking = getTrackingInfo();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">{order.items[0]?.name}</h1>

      {reviewSubmitted && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Review submitted successfully! Thank you for your feedback.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 border rounded">
          {/* Order status bar */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🚚</span>
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Shipped</p>
                  <p className="text-sm text-gray-600">
                    In transit - arriving {new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTracking(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Track package
              </button>
            </div>
          </div>

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
                className="text-blue-600 text-sm mt-2 block hover:underline"
              >
                View product details
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">How's your item?</h3>
            <button 
              onClick={handleWriteReview}
              className="mt-2 px-4 py-2 border rounded text-sm hover:bg-gray-50 transition-colors"
            >
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
          
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => setShowTracking(true)}
              className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm underline"
            >
              Click for updates
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {showTracking && (
        <TrackingModal 
          tracking={tracking} 
          onClose={() => setShowTracking(false)} 
        />
      )}

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Write a Review</h3>
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded">
                <img
                  src={order.items[0]?.image}
                  alt={order.items[0]?.name}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h4 className="font-medium">{order.items[0]?.name}</h4>
                  <p className="text-sm text-gray-600">Verified Purchase</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Overall rating</label>
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
                
                <div>
                  <label className="block font-medium mb-2">Add a headline</label>
                  <input
                    type="text"
                    placeholder="What's most important to know?"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">{newReview.title.length}/60 characters</p>
                </div>
                
                <div>
                  <label className="block font-medium mb-2">Add a written review</label>
                  <textarea
                    placeholder="What did you like or dislike? What did you use this product for?"
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full border rounded px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{newReview.comment.length}/500 characters</p>
                </div>
                
                <div className="flex items-center text-sm text-green-600">
                  <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2 flex-shrink-0">
                    <span className="block text-white text-xs leading-4 text-center">✓</span>
                  </span>
                  <span>Verified Purchase - You bought this item</span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={submittingReview || !newReview.title.trim() || !newReview.comment.trim()}
                  className="flex-1 bg-yellow-400 py-2 px-4 rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};