import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        fetch(`http://localhost:8000/users/${user.id}`).then(res => res.json()),
        fetch(`http://localhost:8000/orders?userId=${user.id}&_sort=date&_order=desc&_limit=3`).then(res => res.json())
      ]).then(([profile, orders]) => {
        setUserProfile(profile);
        setRecentOrders(orders);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl mb-4">Please sign in to access your account</h1>
        <Link to="/login" className="bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <div className="max-w-4xl mx-auto p-6">Loading...</div>;

  const accountSections = [
    {
      title: "Your Orders",
      description: "Track, return, cancel an order, download invoice or buy again",
      icon: "📦",
      link: "/orders",
    },
    {
      title: "Login & Security",
      description: "Edit login, name, and mobile number",
      icon: "🔒",
      link: "/account/security",
    },
    {
      title: "Your Addresses",
      description: "Edit addresses for orders and gifts",
      icon: "📍",
      link: "/account/addresses",
    },
    {
      title: "Your wishlist",
      description: "View, modify, and share your lists, or create new ones",
      icon: "📝",
      link: "/wishlist",
    },
    {
      title: "Customer Service",
      description: "Browse self service options, help articles or contact us",
      icon: "🎧",
      link: "/help",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Your Account</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Hello, {userProfile?.name || user.name}!</span>
          <button 
            onClick={logout}
            className="text-blue-600 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Recent Orders Quick View */}
      {recentOrders.length > 0 && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Your recent orders</h2>
            <Link to="/orders" className="text-blue-600 hover:underline text-sm">
              View all orders
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex-shrink-0 w-48 p-3 bg-white border rounded">
                <div className="text-xs text-gray-500 mb-1">
                  Order placed: {new Date(order.date).toLocaleDateString()}
                </div>
                <div className="font-semibold text-sm mb-2">₹{order.total}</div>
                {order.items && order.items.length > 0 && (
                  <div className="flex items-center gap-2">
                    <img 
                      src={order.items[0].image} 
                      alt={order.items[0].name}
                      className="w-8 h-8 object-contain"
                    />
                    <div className="text-xs truncate">{order.items[0].name}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountSections.map((section, index) => (
          <Link
            key={index}
            to={section.link}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white block"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{section.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Quick Actions */}
      <div className="mt-8 p-4 border rounded-lg bg-blue-50">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/orders" className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
            Track Package
          </Link>
          <Link to="/returns" className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
            Return Item
          </Link>
          <Link to="/wishlist" className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
            Your Wishlist
          </Link>
          <Link to="/account/addresses" className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
            Manage Addresses
          </Link>
          <Link to="/account/payments" className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
            Payment Methods
          </Link>
        </div>
      </div>
    </div>
  );
};
