

export const Footer = () => { 
return (
    <div className="w-full">
      {/* Back to top section */}
      <div className="bg-gray-600 hover:bg-gray-500 transition-colors cursor-pointer">
        <div className="text-center py-4">
          <span className="text-white text-sm font-normal">Back to top</span>
        </div>
      </div>
      
      {/* Main footer links section */}
      <div className="bg-slate-700 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-16">
            {/* Get to Know Us Column */}
            <div>
              <h3 className="text-white font-bold text-base mb-3 leading-6">Get to Know Us</h3>
              <div className="space-y-1">
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Careers</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Blog</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">About Amazon</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Investor Relations</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Amazon Devices</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Amazon Science</a></div>
              </div>
            </div>
            
            {/* Make Money with Us Column */}
            <div>
              <h3 className="text-white font-bold text-base mb-3 leading-6">Make Money with Us</h3>
              <div className="space-y-1">
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Sell products on Amazon</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Sell on Amazon Business</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Sell apps on Amazon</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Become an Affiliate</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Advertise Your Products</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Self-Publish with Us</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Host an Amazon Hub</a></div>
                <div className="mt-2">
                  <a href="#" className="text-white text-sm hover:underline block leading-5">› See More Make Money</a>
                  <a href="#" className="text-white text-sm hover:underline block leading-5 ml-2">with Us</a>
                </div>
              </div>
            </div>
            
            {/* Amazon Payment Products Column */}
            <div>
              <h3 className="text-white font-bold text-base mb-3 leading-6">Amazon Payment Products</h3>
              <div className="space-y-1">
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Amazon Business Card</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Shop with Points</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Reload Your Balance</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Amazon Currency Converter</a></div>
              </div>
            </div>
            
            {/* Let Us Help You Column */}
            <div>
              <h3 className="text-white font-bold text-base mb-3 leading-6">Let Us Help You</h3>
              <div className="space-y-1">
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Amazon and COVID-19</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Your Account</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Your Orders</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Shipping Rates &</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5 ml-0">Policies</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Returns &</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5 ml-0">Replacements</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Manage Your</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5 ml-0">Content and Devices</a></div>
                <div><a href="#" className="text-white text-sm hover:underline block leading-5">Help</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Amazon logo and selectors section */}
      <div className="bg-slate-700 border-t border-slate-600">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center space-x-6">
            {/* Amazon logo */}
            <div className="flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className="w-24 mr-5 mt-2" />
            </div>
            
            {/* Language selector */}
            <div className="border border-gray-400 rounded-sm">
              <select className="bg-transparent text-white text-sm px-4 py-2 pr-8 outline-none cursor-pointer appearance-none bg-slate-700">
                <option className="bg-slate-700">🌐 English</option>
              </select>
            </div>
            
            {/* Currency selector */}
            <div className="border border-gray-400 rounded-sm">
              <select className="bg-transparent text-white text-sm px-4 py-2 pr-8 outline-none cursor-pointer appearance-none bg-slate-700">
                <option className="bg-slate-700">$ USD - U.S. Dollar</option>
              </select>
            </div>
            
            {/* Country selector */}
            <div className="border border-gray-400 rounded-sm">
              <select className="bg-transparent text-white text-sm px-4 py-2 pr-8 outline-none cursor-pointer appearance-none bg-slate-700">
                <option className="bg-slate-700">🇺🇸 United States</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products section */}
      <div className="bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-6 gap-x-8 gap-y-6 text-xs">
            
            {/* Row 1 */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">Amazon Music</h4>
                <p className="text-gray-300 leading-4">Stream millions<br />of songs</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Amazon Business</h4>
                <p className="text-gray-300 leading-4">Everything For<br />Your Business</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">IMDbPro</h4>
                <p className="text-gray-300 leading-4">Get Info<br />Entertainment<br />Professionals Need</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">Amazon Ads</h4>
                <p className="text-gray-300 leading-4">Reach customers<br />wherever they<br />spend their time</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">AmazonGlobal</h4>
                <p className="text-gray-300 leading-4">Ship Orders<br />Internationally</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Kindle Direct</h4>
                <h4 className="text-white font-bold mb-1">Publishing</h4>
                <p className="text-gray-300 leading-4">Indie Digital &<br />Print Publishing<br />Made Easy</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">6pm</h4>
                <p className="text-gray-300 leading-4">Score deals<br />on fashion brands</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Amazon Web</h4>
                <h4 className="text-white font-bold mb-1">Services</h4>
                <p className="text-gray-300 leading-4">Scalable Cloud<br />Computing<br />Services</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Prime Video Direct</h4>
                <p className="text-gray-300 leading-4">Video Distribution<br />Made Easy</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">AbeBooks</h4>
                <p className="text-gray-300 leading-4">Books, art<br />& collectibles</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Audible</h4>
                <p className="text-gray-300 leading-4">Listen to Books &<br />Original<br />Audio<br />Performances</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Shopbop</h4>
                <p className="text-gray-300 leading-4">Designer<br />Fashion Brands</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">ACX</h4>
                <p className="text-gray-300 leading-4">Audiobook<br />Publishing<br />Made Easy</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Box Office Mojo</h4>
                <p className="text-gray-300 leading-4">Find Movie<br />Box Office Data</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Woot!</h4>
                <p className="text-gray-300 leading-4">Deals and<br />Shenanigans</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">Sell on Amazon</h4>
                <p className="text-gray-300 leading-4">Start a Selling<br />Account</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Goodreads</h4>
                <p className="text-gray-300 leading-4">Book reviews<br />&<br />recommendations</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Zappos</h4>
                <p className="text-gray-300 leading-4">Shoes &<br />Clothing</p>
              </div>
            </div>
            
            {/* Row 2 */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">eero WiFi</h4>
                <p className="text-gray-300 leading-4">Stream 4K Video<br />in Every Room</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">Blink</h4>
                <p className="text-gray-300 leading-4">Smart Security<br />for Every Home</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">Neighbors App</h4>
                <p className="text-gray-300 leading-4">Real-Time Crime<br />& Safety Alerts</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">Amazon</h4>
                <h4 className="text-white font-bold mb-1">Subscription Boxes</h4>
                <p className="text-gray-300 leading-4">Top subscription<br />boxes – right to<br />your door</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">PillPack</h4>
                <p className="text-gray-300 leading-4">Pharmacy<br />Simplified</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold mb-1">Veeqo</h4>
                <p className="text-gray-300 leading-4">Shipping Software<br />Inventory<br />Management</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">IMDb</h4>
                <p className="text-gray-300 leading-4">Movies, TV<br />& Celebrities</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Ring</h4>
                <p className="text-gray-300 leading-4">Smart Home<br />Security Systems</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Legal footer */}
      <div className="bg-slate-900 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center space-x-4 mb-4">
              <a href="#" className="text-gray-300 text-xs hover:underline">Conditions of Use</a>
              <a href="#" className="text-gray-300 text-xs hover:underline">Privacy Notice</a>
              <a href="#" className="text-gray-300 text-xs hover:underline">Consumer Health Data Privacy Disclosure</a>
              <a href="#" className="text-gray-300 text-xs hover:underline">Your Ads Privacy Choices</a>
              <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                  <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/>
                </svg>
              </div>
            </div>
            <p className="text-gray-300 text-xs">© 1996-2025, Amazon.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </div>
  );
}