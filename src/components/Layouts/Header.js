import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import amazonLogo from "../../assets/amazon_logo.png";
import locationIcon from "../../assets/location_icon.png";
import dropdownIcon from "../../assets/dropdown_icon.png";
import searchIcon from "../../assets/search_icon.png";
import usFlag from "../../assets/us_flag.png";
import cart from "../../assets/cart_icon.png";
import { useAuth } from "../../hooks"; // Import useAuth hook

export const Header = () => {
  const { user, logout } = useAuth(); // Get user and logout from useAuth hook
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false); // For account dropdown
  const [activeSection, setActiveSection] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  const labelRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(null);

  useEffect(() => {
    if (labelRef.current) {
      setButtonWidth(labelRef.current.offsetWidth + 50);
    }
  }, [selectedCategory]);

  const categories = [
    "All",
    "Amazon Devices",
    "Books",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Sports & Outdoors",
    "Health & Personal Care",
  ];

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setActiveSection(isCategoryOpen ? null : "category");
    setIsAccountMenuOpen(false); // Close account menu when opening category
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
    setIsCategoryOpen(false); // Close category menu when opening account
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

  return (
    <nav
      className="flex items-center justify-between bg-[#131921] px-5 py-2 text-white"
      style={{ height: 60 }}
    >
      {/* Amazon Logo */}
      <Link to="/" className="flex-shrink-0">
        <img src={amazonLogo} alt="Amazon Logo" width={120} />
      </Link>

      {/* Delivery location */}
      <div className="flex items-end ml-4 mr-3 text-[13px] text-gray-400 cursor-pointer">
        <img
          src={locationIcon}
          alt="Location Icon"
          className="h-7 mr-2 mb-1"
        />
        <div>
          <p className="text-sm">Deliver to</p>
          <h1 className="text-sm text-white font-semibold">INDIA</h1>
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
          {/* Dropdown Menu */}
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
          className="flex-grow outline-none border-none px-5 py-2 text-lg"
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
        />

        {/* Search Icon */}
        <img
          src={searchIcon}
          alt="Search Icon"
          className="max-w-[44px] p-2 bg-yellow-400 rounded-r-md cursor-pointer"
        />
      </div>

      {/* Language selector */}
      <div className="flex items-center gap-1 font-semibold text-sm ml-4 cursor-pointer">
        <img src={usFlag} alt="US Flag" className="w-8" />
        <p>EN</p>
        <img src={dropdownIcon} alt="Dropdown" className="w-2" />
      </div>

      {/* Account & Lists */}
      <div className="relative ml-4 text-xs cursor-pointer">
        <div onClick={toggleAccountMenu}>
          <p className="hover:underline">
            {user ? (
              <>
                Hello, <span className="font-semibold">{user.name}</span>
              </>
            ) : (
              <Link to="/login">Hello, sign in</Link>
            )}
          </p>
          <h1 className="text-sm font-semibold flex items-center gap-1">
            Account & Lists
            <img src={dropdownIcon} alt="Dropdown" className="w-2" />
          </h1>
        </div>
        
        {/* Account Dropdown Menu */}
        {isAccountMenuOpen && user && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white text-black rounded-sm shadow-lg border z-50">
            <div className="p-3 border-b border-gray-200">
              <p className="font-semibold">Hello, {user.name}</p>
            </div>
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/account">Your Account</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/orders">Your Orders</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/wishlist">Your Wish List</Link>
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

      {/* Returns & Orders */}
      <div className="ml-4 text-xs cursor-pointer">
        <p>Returns</p>
        <h1 className="text-sm font-semibold">& Orders</h1>
      </div>

      {/* Cart */}
      <Link to="/cart" className="relative flex items-end ml-4 cursor-pointer">
        <img src={cart} alt="Cart Icon" className="w-9" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-yellow-400 text-black rounded-full text-xs font-bold px-2 -translate-x-1/2 translate-y-1/2">
            {cartCount}
          </span>
        )}
        <h4 className="text-sm font-semibold ml-1">Cart</h4>
      </Link>
    </nav>
  );
};