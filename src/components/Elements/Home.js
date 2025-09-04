import { useEffect, useState } from "react";
import { BannerSlider } from "./Bannerslider";
export const Home = () => {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/banners")
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch(console.error);
  }, []);



  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Slider Section */}
      <div className="w-full ">
         <BannerSlider banners={banners} />
      </div>
    </div>
  );
}; 