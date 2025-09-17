import { Link } from "react-router-dom";

export const OrderSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-green-600 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
          />
        </svg>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us. Your order has been placed and will be
          delivered soon.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/orders"
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded font-semibold"
          >
            View Orders
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
