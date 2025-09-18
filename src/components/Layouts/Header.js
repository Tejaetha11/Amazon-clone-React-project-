// components/Header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import amazonLogo from "../../assets/amazon_logo.png";
import locationIcon from "../../assets/location_icon.png";
import dropdownIcon from "../../assets/dropdown_icon.png";
import searchIcon from "../../assets/search_icon.png";
import usFlag from "../../assets/us_flag.png";
import { useAuth } from "../../hooks";
import { useCart } from "../../hooks/useCart"; 
import { ShoppingCart } from "lucide-react"; 

export const Header = () => {
  const { user, logout, updateUser } = useAuth();
  const { getCartCount } = useCart(); 
  const navigate = useNavigate();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentLocation, setCurrentLocation] = useState("INDIA");
  const [currentPincode, setCurrentPincode] = useState("520010");
  const [pincodeInput, setPincodeInput] = useState("");

  const labelRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(null);

  // ✅ Sample location data
  const locationData = {
    "520010": "Vijayawada",
    "500001": "Hyderabad",
    "600001": "Chennai",
    "560001": "Bangalore",
    "400001": "Mumbai",
    "110001": "New Delhi",
    "700001": "Kolkata",
    "411001": "Pune",
    "380001": "Ahmedabad",
    "226001": "Lucknow",
    "302001": "Jaipur",
  };

  // On login, load user address
  useEffect(() => {
    if (user?.address) {
      setCurrentLocation(user.address.city || "India");
      setCurrentPincode(user.address.pincode || "");
    }
  }, [user]);

  useEffect(() => {
    if (labelRef.current) {
      setButtonWidth(labelRef.current.offsetWidth + 50);
    }
  }, [selectedCategory]);

  const categories = [
    "All",
    "Earbuds",
    "Headphones", 
    "Neckbands",
    "boAt",
    "boult",
    "Electronics",
  ];

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setActiveSection(isCategoryOpen ? null : "category");
    setIsAccountMenuOpen(false);
  };

  const toggleAccountMenu = () => {
    if (user) {
      setIsAccountMenuOpen(!isAccountMenuOpen);
      setIsCategoryOpen(false);
    }
  };

  const toggleLocationModal = () => {
    setIsLocationModalOpen(!isLocationModalOpen);
    setIsCategoryOpen(false);
    setIsAccountMenuOpen(false);
    setPincodeInput("");
  };

  const onSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setIsCategoryOpen(false);
    setActiveSection(null);
  };

  const onSearchFocus = () => {
    setActiveSection("search");
    setIsCategoryOpen(false);
    setIsAccountMenuOpen(false);
  };

  const onSearchBlur = () => {
    setActiveSection(null);
    setIsCategoryOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
  };

  //  Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams({
        q: searchQuery.trim(),
        category: selectedCategory !== "All" ? selectedCategory : ""
      });
      navigate(`/search?${searchParams.toString()}`);
      setSearchQuery("");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Save pincode 
  const handlePincodeSubmit = async () => {
    const pincode = pincodeInput.trim();
    if (pincode && locationData[pincode]) {
      const city = locationData[pincode];
      setCurrentLocation(city);
      setCurrentPincode(pincode);

      if (user) {
        const updatedUser = { ...user, address: { pincode, city } };
        await updateUser(updatedUser);
      }

      setIsLocationModalOpen(false);
      setPincodeInput("");
    } else if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setCurrentLocation("India");
      setCurrentPincode(pincode);

      if (user) {
        const updatedUser = { ...user, address: { pincode, city: "India" } };
        await updateUser(updatedUser);
      }

      setIsLocationModalOpen(false);
      setPincodeInput("");
    } else {
      alert("Please enter a valid 6-digit Indian pincode");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePincodeSubmit();
    }
  };

  const handleSignInToSeeAddresses = () => {
    setIsLocationModalOpen(false);
    window.location.href = "/login";
  };

  return (
    <>
      <nav
        className="flex items-center justify-between bg-[#131921] px-5 py-2 text-white"
        style={{ height: 60 }}
      >
        {/* Amazon Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={amazonLogo} alt="Amazon Logo" width={120} />
        </Link>

        {/* Delivery location */}
        <div
          className="flex items-end ml-4 mr-3 text-[13px] text-gray-400 cursor-pointer hover:border hover:border-white rounded p-1 transition-all duration-200"
          onClick={toggleLocationModal}
        >
          <img
            src={locationIcon}
            alt="Location Icon"
            className="h-7 mr-2 mb-1"
          />
          <div>
            <p className="text-sm">Deliver to</p>
            <h1 className="text-sm text-white font-semibold">
              {currentLocation} {currentPincode}
            </h1>
          </div>
        </div>

        {/* Search bar */}
        <div
          className={`flex flex-1 items-center max-w-[1100px] ml-4 rounded-md bg-white text-gray-600 transition-border duration-300 ${
            activeSection === "search" ? "border-2 border-yellow-400" : ""
          }`}
        >
          {/* Category Dropdown */}
          <div
            className={`relative flex items-center px-5 py-3 gap-1 rounded-l-md cursor-pointer bg-gray-300 text-black select-none transition-all duration-300 ${
              activeSection === "category" ? "border-2 border-yellow-400" : ""
            }`}
            onClick={toggleCategoryDropdown}
            tabIndex={0}
            style={{ width: buttonWidth ? buttonWidth : "auto", minWidth: 70 }}
            onBlur={onSearchBlur}
          >
            <p ref={labelRef} className="text-sm whitespace-nowrap">
              {selectedCategory}
            </p>
            <img src={dropdownIcon} alt="Dropdown" className="h-3" />
            {isCategoryOpen && (
              <ul className="absolute left-0 top-full mt-1 w-[170px] bg-[#fafafa] rounded-sm shadow border z-50 max-h-60 overflow-auto">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className="px-4 py-2 text-black text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => onSelectCategory(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search Amazon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress ={handleSearchKeyPress}
            className="flex-grow outline-none border-none px-5 py-2 text-lg text-black"
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />

          {/* Search Icon */}
          <div
            onClick={handleSearch}
            className="max-w-[44px] p-2 bg-yellow-400 rounded-r-md cursor-pointer hover:bg-yellow-500 transition-colors duration-200"
          >
            <img src={searchIcon} alt="Search Icon" className="w-full h-full" />
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1 font-semibold text-sm ml-4 cursor-pointer">
          <img src={usFlag} alt="US Flag" className="w-8" />
          <p>EN</p>
          <img src={dropdownIcon} alt="Dropdown" className="w-2" />
        </div>

        {/* Account & Lists */}
        <div className="relative ml-4 text-xs cursor-pointer">
          <div onClick={toggleAccountMenu} className={!user ? "cursor-not-allowed opacity-60" : ""}>
            <p className={user ? "hover:underline" : ""}>
              {user ? (
                <>
                  Hello, <span className="font-semibold">{user.name}</span>
                </>
              ) : (
                <Link to="/login" className="hover:underline">Hello, sign in</Link>
              )}
            </p>
            <h1 className="text-sm font-semibold flex items-center gap-1">
              Account & Lists
              {user && <img src={dropdownIcon} alt="Dropdown" className="w-2" />}
            </h1>
          </div>

          {/* Simple dropdown when logged in */}
          {isAccountMenuOpen && user && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white text-black rounded-sm shadow-lg border z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="font-semibold">Hello, {user.name}</p>
              </div>
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link 
                    to="/account"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Your Account
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link 
                    to="/orders"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Your Orders
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link 
                    to="/wishlist"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Your Wish List
                  </Link>
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                  onClick={handleLogout}
                >
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Returns & Orders - Disabled when not logged in */}
        {user ? (
          <Link 
            to="/orders" 
            className="ml-4 text-xs cursor-pointer hover:border hover:border-white rounded p-1 transition-all duration-200"
          >
            <p>Returns</p>
            <h1 className="text-sm font-semibold">& Orders</h1>
          </Link>
        ) : (
          <div className="ml-4 text-xs cursor-not-allowed opacity-60">
            <p>Returns</p>
            <h1 className="text-sm font-semibold">& Orders</h1>
          </div>
        )}

        {/* Cart */}
        <Link to="/cart" className="relative flex items-center ml-6 cursor-pointer hover:border hover:border-white rounded p-1 transition-all duration-200">
          <div className="relative">
            <ShoppingCart className="w-9 h-9 text-white" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full text-xs font-bold px-2 py-0.5">
                {getCartCount()}
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold ml-2">Cart</h4>
        </Link>
      </nav>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Choose your location
              </h2>
              <button
                onClick={toggleLocationModal}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select a delivery location to see product availability and
                delivery options
              </p>

              {!user && (
                <button
                  onClick={handleSignInToSeeAddresses}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-md transition-colors duration-200"
                >
                  Sign in to see your addresses
                </button>
              )}

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">
                  or enter an Indian pincode
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  maxLength="6"
                />
                <button
                  onClick={handlePincodeSubmit}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md transition-colors duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
