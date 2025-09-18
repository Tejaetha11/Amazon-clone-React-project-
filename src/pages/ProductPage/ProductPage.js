import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";  // Added Link import
import { useCart } from "../../hooks";
import { API_BASE_URL } from "../../Config/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const query = useQuery();
  const brand = query.get("brand");

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((allProducts) => {
        setProducts(
          brand
            ? allProducts.filter(
                (p) => p.brand.toLowerCase() === brand.toLowerCase()
              )
            : allProducts
        );
      })
      .catch(console.error);
  }, [brand]);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">
        {brand ? `Results for "${brand}"` : "All Products"}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition flex flex-col p-3"
          >
            {product.tag && (
              <span
                className={`text-xs font-semibold mb-1 ${
                  product.tag === "Best seller"
                    ? "bg-orange-500 text-white px-2 py-0.5 rounded"
                    : "text-gray-500"
                }`}
              >
                {product.tag}
              </span>
            )}

            {/* Wrap image and name inside Link to single product page */}
            <Link to={`/products/${product.id}`} className="cursor-pointer">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-contain mb-2"
              />
              <div className="font-medium text-sm text-gray-800 line-clamp-2 h-10 mb-1">
                {product.name}
              </div>
            </Link>

            {product.variants && (
              <div className="text-xs text-blue-600 mb-1">
                +{product.variants.length} other color/pattern
              </div>
            )}

            <div className="flex items-center text-yellow-500 text-xs mb-1">
              {"★".repeat(Math.round(product.rating || 4))}
              <span className="ml-2 text-gray-500">
                ({product.reviews || 200})
              </span>
            </div>

            <div className="flex items-baseline mb-1">
              <span className="text-lg font-bold text-Black-700 mr-2">
                ₹{product.price}
              </span>
              {product.mrp && (
                <span className="line-through text-gray-400 text-xs mr-2">
                  ₹{product.mrp}
                </span>
              )}
              {product.discount && (
                <span className="bg-yellow-200 text-yellow-800 text-xs px-1 rounded">
                  {product.discount}
                </span>
              )}
            </div>

            {product.coupon && (
              <div className="text-xs text-green-600 mb-1">
                Save ₹{product.coupon} with coupon
              </div>
            )}

            {product.deal && (
              <div className="text-xs text-red-600 font-semibold mb-1">
                Limited time deal
              </div>
            )}

            <div className="text-xs text-gray-600 mb-1">
              FREE delivery{" "}
              <span className="font-medium text-gray-800">Sun, 7 Sept</span>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-yellow-400 rounded font-semibold hover:bg-yellow-500 transition text-sm"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
