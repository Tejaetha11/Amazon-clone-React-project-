import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart, useAuth } from "../../hooks";

export const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [wishlistItem, setWishlistItem] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8000/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      }
      setLoadingProduct(false);
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!user) {
      setWishlistItem(null);
      return;
    }
    async function fetchWishlist() {
      try {
        const res = await fetch(
          `http://localhost:8000/wishlist?userId=${user.id}&productId=${id}`
        );
        const data = await res.json();
        setWishlistItem(data.length > 0 ? data[0] : null);
      } catch {
        setWishlistItem(null);
      }
    }
    fetchWishlist();
  }, [user, id]);

  const addWishlist = async () => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (wishlistItem) return;

    const newItem = {
      userId: user.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    };

    try {
      const res = await fetch("http://localhost:8000/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const created = await res.json();
        setWishlistItem(created);
      }
    } catch {}
  };

  const removeWishlist = async () => {
    if (!wishlistItem) return;

    try {
      const res = await fetch(`http://localhost:8000/wishlist/${wishlistItem.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWishlistItem(null);
      }
    } catch {}
  };

  if (loadingProduct) return <div className="p-12">Loading...</div>;
  if (!product) return <div className="p-12">Product not found</div>;

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 px-4">
        {/* Left Section */}
        <div className="flex flex-col items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-72 h-72 object-contain bg-white border rounded mb-4"
          />
          <div
            className="text-center text-xs text-blue-600 cursor-pointer"
            onClick={() => setIsZoomOpen(true)}
          >
            Click to see full view
          </div>
          {isZoomOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
              onClick={() => setIsZoomOpen(false)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded shadow-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>

        {/* Middle Section */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">{'★'.repeat(Math.round(product.rating || 4))}</span>
            <span className="ml-2 text-blue-600 text-sm">{product.reviews} ratings</span>
          </div>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-700">₹{product.price}</span>
            {product.mrp && <span className="line-through text-gray-500">₹{product.mrp}</span>}
            {product.discount && <span className="text-orange-600 font-semibold">{product.discount}</span>}
          </div>
          <div className="space-y-1 mb-2 text-sm">
            <b className="text-yellow-600">Prime</b> Inclusive of all taxes<br />
            EMI starts at <b>₹78</b>. <span className="text-blue-600 cursor-pointer underline">EMI options</span>
          </div>
          <div className="text-xs mb-2">
            With Amazon Business, save up to 15%. <span className="underline cursor-pointer text-blue-700">Create a free account</span>
          </div>
          <div className="flex overflow-x-auto gap-3 mb-3">
            <div className="bg-gray-100 border rounded p-2 min-w-[180px]">
              <b>Cashback</b><br />Upto ₹79 cashback<br /><span className="cursor-pointer underline text-blue-600">4 offers</span>
            </div>
            <div className="bg-gray-100 border rounded p-2 min-w-[180px]">
              <b>Bank Offer</b><br />Up to ₹1,250 off<br /><span className="cursor-pointer underline text-blue-600">19 offers</span>
            </div>
            <div className="bg-gray-100 border rounded p-2 min-w-[180px]">
              <b>No Cost EMI</b><br />No cost EMI<br /><span className="cursor-pointer underline text-blue-600">1 offer</span>
            </div>
            <div className="bg-gray-100 border rounded p-2 min-w-[180px]">
              <b>Partner Offer</b><br />Get GST invoice<br /><span className="cursor-pointer underline text-blue-600">1 offer</span>
            </div>
          </div>
          <div className="flex gap-6 text-xs mb-4 text-gray-700">
            <div className="text-center">
              <b>10 days</b> <br /> Service Centre Replacement
            </div>
            <div className="text-center">
              <b>Free</b> <br /> Delivery
            </div>
            <div className="text-center">
              <b>1 year</b> <br /> Warranty
            </div>
            <div className="text-center font-bold">Amazon Delivered</div>
            <div className="text-center font-bold">Secure Transaction</div>
          </div>
          <div className="bg-gray-50 border rounded p-4 w-72 mb-6">
            <div><b>Brand:</b> {product.brand}</div>
            <div><b>Colour:</b> {product.color || "White"}</div>
            <div><b>Ear Placement:</b> {product.earPlacement}</div>
            <div><b>Form Factor:</b> {product.formFactor}</div>
            <div><b>Noise Control:</b> {product.noiseControl}</div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">About the product</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
              {product.about?.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="border rounded p-6 bg-white max-w-sm shadow">
          <div className="text-3xl font-bold text-green-700 mb-3">₹{product.price}</div>
          <div className="mb-2 font-semibold text-green-700">In stock</div>
          <div className="mb-4 text-sm">FREE delivery <b>Saturday, 13 September</b></div>
          <div className="mb-4 text-xs">Deliver to <b>Teja – Amalapuram 533222</b></div>
          <div className="mb-4">
            <label htmlFor="qty" className="mr-2 text-sm">Qty:</label>
            <select
              id="qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-1 rounded"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-full bg-yellow-400 py-2 rounded text-black mb-2 hover:bg-yellow-500"
            onClick={() => addToCart({ ...product, quantity })}
          >
            Add to Cart
          </button>
          <button
            className="w-full bg-orange-600 py-2 rounded text-white mb-2 hover:bg-orange-700"
            onClick={() => {
              addToCart({ ...product, quantity });
              navigate("/checkout");
            }}
          >
            Buy Now
          </button>
          {wishlistItem ? (
            <button
              className="w-full border py-2 rounded mb-2 hover:bg-gray-100"
              onClick={removeWishlist}
            >
              Remove from Wishlist
            </button>
          ) : (
            <button
              className="w-full border py-2 rounded mb-2 hover:bg-gray-100"
              onClick={addWishlist}
            >
              Add to Wishlist
            </button>
          )}
          <div className="bg-yellow-50 border-t rounded p-3 text-center mt-4">
            <b>amazon business</b>
            <p>Save up to 15% with business pricing and GST input tax credit</p>
            <button className="underline text-blue-600 mt-2">Create a free account</button>
          </div>
        </div>
      </div>
    </div>
  );
};
