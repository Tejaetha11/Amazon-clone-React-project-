import { useEffect, useState } from "react";
import { BannerSlider } from "./Bannerslider";
import { MultiItemCard } from "./MultiItemCard";
import { ProductCarousel } from "./productCarousel"; 
import {API_BASE_URL} from "../../../Config/api";

export const Home = () => {

  const [banners, setBanners] = useState([]);
  const [sections, setSections] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [moreItems, setMoreItems] = useState([]);
  const [moreSections, setMoreSections] = useState([]);
  const [toppicks, setToppicks] = useState([]);
  const[bestsellers,setBestsellers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/banners`)
      .then((res) => res.json())
      .then(setBanners)
      .catch(console.error);

    fetch(`${API_BASE_URL}/homepageSections`)
      .then((res) => res.json())
      .then(setSections)
      .catch(console.error);

    fetch(`${API_BASE_URL}/relatedItems`)
      .then((res) => res.json())
      .then(setRelatedItems)
      .catch(console.error);

    fetch(`${API_BASE_URL}/moreItems`)
      .then((res) => res.json())
      .then(setMoreItems)
      .catch(console.error);

    fetch(`${API_BASE_URL}/moreSections`)
    .then(res => res.json())
    .then(setMoreSections)
    .catch(console.error);

    fetch(`${API_BASE_URL}/toppicks`)
    .then(res => res.json())
    .then(setToppicks)
    .catch(console.error);

    fetch(`${API_BASE_URL}/bestsellers`)
    .then(res => res.json())
    .then(setBestsellers)
    .catch(console.error); 
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Banner */}
      <div className="relative">
        <BannerSlider banners={banners} />
      </div>

      {/*  Multi-item Cards */}
      <div className="relative z-30 -mt-48 px-4">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sections.map((section, index) => (
              <MultiItemCard
                key={index}
                {...section}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Carousels */}
      <div className="mt-3 space-y-6 relative z-20">
        <ProductCarousel
          title="Related to items you've viewed"
          products={relatedItems}
          Seemore={'#'}
        />
        <ProductCarousel
          title="More items to consider"
          products={moreItems}
          Seemore={'https://bespoke-babka-0ee821.netlify.app/products?catageory=eyewear'}
        />
      </div>

       {/*  More Multi-item Cards */}
      <div className="relative z-30 mt-4 px-4">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {moreSections.map((moresection, index) => (
              <MultiItemCard
                key={index}
                {...moresection}
              />
            ))}
          </div>
        </div>
      </div>


      <div className="mt-5 space-y-6 relative z-20">
        <ProductCarousel
          title="Starting  ₹70,348 | set off on your next great ride"
          products={toppicks}
        />
        <ProductCarousel
          title="Up to 80% off | Handcrafted treasures from artisans"
          products={bestsellers}
           Seemore={'https://bespoke-babka-0ee821.netlify.app/products?catageory=two-wheeler'}
        />
      </div>



    </div>

  );
};
