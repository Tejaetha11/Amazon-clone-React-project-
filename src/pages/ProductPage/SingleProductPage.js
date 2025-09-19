import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart, useAuth } from "../../hooks";
import { API_BASE_URL } from "../../Config/api";

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
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('newest');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    verified: false
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
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
          `${API_BASE_URL}/wishlist?userId=${user.id}&productId=${id}`
        );
        const data = await res.json();
        setWishlistItem(data.length > 0 ? data[0] : null);
      } catch {
        setWishlistItem(null);
      }
    }
    fetchWishlist();
  }, [user, id]);

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews?productId=${id}`);
        const data = await res.json();
        setReviews(data);
      } catch {
        setReviews([]);
      }
      setLoadingReviews(false);
    }
    fetchReviews();
  }, [id]);

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
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
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
      const res = await fetch(`${API_BASE_URL}/wishlist/${wishlistItem.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWishlistItem(null);
      }
    } catch {}
  };

  // Submit new review
  const submitReview = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newReview.title.trim() || !newReview.comment.trim()) return;

    setSubmittingReview(true);
    try {
      const reviewData = {
        ...newReview,
        userId: user.id,
        productId: product.id,
        userName: user.name,
        date: new Date().toISOString(),
        helpful: 0
      };

      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        const createdReview = await res.json();
        setReviews(prev => [createdReview, ...prev]);
        setNewReview({ rating: 5, title: '', comment: '', verified: false });
        setShowWriteReview(false);
      }
    } catch {
      // Handle error
    }
    setSubmittingReview(false);
  };

  // Filter and sort reviews
  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;
    
    if (reviewFilter !== 'all') {
      const rating = parseInt(reviewFilter);
      filtered = reviews.filter(review => review.rating === rating);
    }

    return filtered.sort((a, b) => {
      switch (reviewSort) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'helpful':
          return (b.helpful || 0) - (a.helpful || 0);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const renderStars = (rating, size = "text-sm") => {
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Helper function to render product specifications based on category
  const renderProductSpecs = () => {
    const commonSpecs = (
      <>
        <div><b>Brand:</b> {product.brand}</div>
        <div><b>Colour:</b> {product.color || "White"}</div>
      </>
    );

    switch (product.catageory) {
      case 'electronics':
        return (
          <>
            {commonSpecs}
            {product.earPlacement && <div><b>Ear Placement:</b> {product.earPlacement}</div>}
            {product.formFactor && <div><b>Form Factor:</b> {product.formFactor}</div>}
            {product.noiseControl && <div><b>Noise Control:</b> {product.noiseControl}</div>}
          </>
        );
      
      case 'eyewear':
        return (
          <>
            {commonSpecs}
            {product.frameMaterial && <div><b>Frame Material:</b> {product.frameMaterial}</div>}
            {product.lensType && <div><b>Lens Type:</b> {product.lensType}</div>}
          </>
        );
      
      case 'clothing':
        return (
          <>
            {commonSpecs}
            {product.material && <div><b>Material:</b> {product.material}</div>}
            {product.size && <div><b>Size:</b> {product.size}</div>}
            {product.fit && <div><b>Fit:</b> {product.fit}</div>}
          </>
        );
      
      default:
        return commonSpecs;
    }
  };

  if (loadingProduct) return <div className="p-12">Loading...</div>;
  if (!product) return <div className="p-12">Product not found</div>;

  const ratingDistribution = getRatingDistribution();
  const filteredReviews = getFilteredAndSortedReviews();
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : product.rating || 4;

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-8">
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
              <span className="text-yellow-500">{'★'.repeat(Math.round(averageRating))}</span>
              <span className="ml-2 text-blue-600 text-sm">{reviews.length} ratings</span>
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
            
            {/* Updated Product Specifications Section */}
            <div className="bg-gray-50 border rounded p-4 w-72 mb-6">
              {renderProductSpecs()}
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

        {/* Reviews Section */}
        <div className="bg-white border rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          {/* Rating Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-6 border-b">
            <div>
              <div className="flex items-center gap-4 mb-4">
                {renderStars(Math.round(averageRating), "text-2xl")}
                <span className="text-2xl font-bold">{averageRating} out of 5</span>
              </div>
              <p className="text-gray-600">{reviews.length} global ratings</p>
              
              {/* Rating Distribution */}
              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm">{rating} star</span>
                    <div className="flex-1 bg-gray-200 rounded h-4 mx-2">
                      <div
                        className="bg-yellow-400 h-4 rounded"
                        style={{
                          width: reviews.length > 0 
                            ? `${(ratingDistribution[rating] / reviews.length) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                    <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                      {ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Review this product</h3>
              <p className="text-gray-600 text-sm">Share your thoughts with other customers</p>
              <button
                onClick={() => setShowWriteReview(true)}
                className="w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-50"
              >
                Write a customer review
              </button>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="font-medium">Filter by stars:</label>
              <select
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="all">All stars</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="font-medium">Sort by:</label>
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="newest">Most recent</option>
                <option value="oldest">Oldest</option>
                <option value="helpful">Most helpful</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {loadingReviews ? (
              <div className="text-center py-8">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {reviewFilter === 'all' ? 'No reviews yet' : 'No reviews found for selected rating'}
              </div>
            ) : (
              filteredReviews.map((review, index) => (
                <div key={index} className="border-b pb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                        {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.userName || 'Anonymous'}</span>
                        {review.verified && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="font-semibold">{review.title}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Reviewed on {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <p className="text-gray-800 mb-3">{review.comment}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="text-gray-600 hover:text-blue-600">
                          👍 Helpful ({review.helpful || 0})
                        </button>
                        <button className="text-gray-600 hover:text-blue-600">
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show more reviews button */}
          {filteredReviews.length > 5 && (
            <div className="text-center mt-6">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                See more reviews
              </button>
            </div>
          )}
        </div>

        {/* Write Review Modal */}
        {showWriteReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Write a Review</h3>
                  <button
                    onClick={() => setShowWriteReview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">Overall rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">Add a headline</label>
                    <input
                      type="text"
                      placeholder="What's most important to know?"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-2">Add a written review</label>
                    <textarea
                      placeholder="What did you like or dislike? What did you use this product for?"
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full border rounded px-3 py-2 h-32 resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={newReview.verified}
                      onChange={(e) => setNewReview(prev => ({ ...prev, verified: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="verified" className="text-sm">This is a verified purchase</label>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowWriteReview(false)}
                    className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    disabled={submittingReview || !newReview.title.trim() || !newReview.comment.trim()}
                    className="flex-1 bg-yellow-400 py-2 px-4 rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};