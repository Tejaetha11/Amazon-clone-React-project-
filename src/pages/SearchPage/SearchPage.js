// pages/SearchPage/SearchPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Fetch all products first
        const response = await fetch(`http://localhost:8000/products`);
        const allProducts = await response.json();
        
        // Filter products based on search query and category
        let filteredProducts = allProducts;
        
        // Filter by search query (searches in name, brand, and about)
        if (query) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.about.some(feature => feature.toLowerCase().includes(query.toLowerCase()))
          );
        }
        
        if (category && category !== "All") {
          filteredProducts = filteredProducts.filter(product => {
            switch(category) {
              case "Electronics":
                return true; 
              case "Headphones":
                return product.formFactor === "Over Ear" || product.earPlacement === "Over Ear" || product.formFactor === "Foldable";
              case "Earbuds":
                return product.formFactor === "TWS" || product.earPlacement === "In Ear";
              case "Neckbands":
                return product.formFactor === "Neckband";
              case "boAt":
                return product.brand.toLowerCase() === "boat";
              case "boult":
                return product.brand.toLowerCase() === "boult";
              default:
                return product.formFactor === category || product.earPlacement === category;
            }
          });
        }
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, category]);

  if (loading) return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array(10).fill().map((_, i) => (
            <div key={i} className="bg-white border rounded-lg shadow-sm p-3">
              <div className="w-full h-40 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* Search Header */}
      <h1 className="text-2xl font-semibold mb-6">
        {query ? `Search results for "${query}"` : 'All Products'}
        {category && category !== "All" && ` in ${category}`}
      </h1>

      {/* Results count */}
      <p className="text-sm text-gray-600 mb-4">
        {products.length} result{products.length !== 1 ? 's' : ''} found
      </p>

      {/* No Results */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or browse our categories
          </p>
          <Link 
            to="/" 
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md transition-colors font-semibold"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        /* Product Grid - Same as ProductsPage */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition flex flex-col p-3"
            >
              {/* Best seller tag (if available) */}
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

              {/* Product Image and Name - Clickable Link */}
              <Link to={`/products/${product.id}`} className="cursor-pointer">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-2"
                  onError={(e) => {
                    e.target.src = '/assets/placeholder-image.png'; // Fallback image
                  }}
                />
                <div className="font-medium text-sm text-gray-800 line-clamp-2 h-10 mb-1">
                  {product.name}
                </div>
              </Link>

              {/* Color variants (if available) */}
              {product.variants && (
                <div className="text-xs text-blue-600 mb-1">
                  +{product.variants.length} other color/pattern
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center text-yellow-500 text-xs mb-1">
                {"★".repeat(Math.round(product.rating || 4))}
                <span className="ml-2 text-gray-500">
                  ({(product.reviews || 200).toLocaleString()})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline mb-1">
                <span className="text-lg font-bold text-black-700 mr-2">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.mrp && (
                  <span className="line-through text-gray-400 text-xs mr-2">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-yellow-200 text-yellow-800 text-xs px-1 rounded">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Coupon (if available) */}
              {product.coupon && (
                <div className="text-xs text-green-600 mb-1">
                  Save ₹{product.coupon} with coupon
                </div>
              )}

              {/* Deal info (if available) */}
              {product.deal && (
                <div className="text-xs text-red-600 font-semibold mb-1">
                  Limited time deal
                </div>
              )}

              {/* Delivery info */}
              <div className="text-xs text-gray-600 mb-1">
                FREE delivery{" "}
                <span className="font-medium text-gray-800">Sun, 15 Sept</span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className="mt-2 px-4 py-2 bg-yellow-400 rounded font-semibold hover:bg-yellow-500 transition text-sm"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
