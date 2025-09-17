import { useEffect, useState } from "react";
import { useAuth, useCart } from "../../hooks";
import { Link } from "react-router-dom";

export const WishlistPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:8000/wishlist?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setWishlist(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleRemove = async (id) => {
    await fetch(`http://localhost:8000/wishlist/${id}`, { method: "DELETE" });
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  if (!user) return <div className="p-6">Login first to access your wishlist.</div>;

  return (
    <div className="max-w-[860px] mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Your Wishlist {wishlist.length > 0 && <span className="text-gray-600 text-lg">({wishlist.length} items)</span>}
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : wishlist.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center font-medium text-gray-700">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="flex rounded border bg-white shadow-sm hover:shadow-md transition w-full">
              {/* Image */}
              <div className="flex-shrink-0 flex items-center justify-center h-32 w-32 bg-gray-50 border-r rounded-l">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="object-contain h-24 max-h-28 max-w-28" />
                ) : (
                  <div className="text-xs text-gray-400 text-center">
                    No image
                    <br />
                    available
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex flex-col justify-center px-4 py-3 flex-grow min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-medium text-base text-blue-800 hover:underline mb-1 truncate"
                  title={item.name}
                >
                  {item.name}
                </Link>
                {item.rating && (
                  <div className="flex items-center text-yellow-600 text-xs font-semibold mb-1">
                    <span>{"★".repeat(Math.round(item.rating))}</span>
                    {item.ratingCount && <span className="ml-1 text-gray-500">({item.ratingCount})</span>}
                  </div>
                )}
                <div className="text-lg font-extrabold text-green-700 mb-1">₹{item.price}</div>
                <div className="text-xs text-gray-500">{item.addedDate ? `Item added ${item.addedDate}` : ""}</div>
              </div>
              {/* Buttons */}
              <div className="flex flex-col justify-center items-center gap-2 p-4 border-l border-gray-200 bg-gray-50 rounded-r">
                <button
                  onClick={() => addToCart({ ...item, quantity: 1 })}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold w-28 py-2 rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-gray-200 hover:bg-red-600 hover:text-white text-gray-900 font-semibold w-28 py-2 rounded"
                >
                  Remove
                </button>
                {/* Optionally add more buttons here */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
