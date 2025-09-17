import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ArrowStyles =
  "absolute top-1/2 -translate-y-1/2 bg-black bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-50";

export const NextArrow = ({ onClick }) => (
  <button
    type="button"
    className={`${ArrowStyles} right-3 top-1/4`}
    onClick={onClick}
    aria-label="Next Slide"
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    className={`${ArrowStyles} left-3 top-1/4`}
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

export const BannerSlider = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

return (
<div className="relative mx-auto max-w-[1500px] overflow-hidden mt-0">
    <Slider {...settings}>
      {banners.map((banner, index) => (
        <div key={index} className="relative">
          <img
            src={banner.image}
            alt={banner.altText || `Banner ${index + 1}`}
            className="w-full h-[500px] object-fit-cover"
          />
        </div>
      ))}
    </Slider>
</div>

  );
};
