import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ArrowStyles =
  "absolute top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-50";

const NextArrow = ({ onClick }) => (
  <button
    className={`${ArrowStyles} right-2`}
    onClick={onClick}
    aria-label="Next"
  >
    <span className="text-white">{">"}</span>
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className={`${ArrowStyles} left-2`}
    onClick={onClick}
    aria-label="Prev"
  >
    <span className="text-white">{"<"}</span>
  </button>
);

export const ProductCarousel = ({ title, products, Seemore }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="bg-white p-4 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <a href={Seemore} className="text-blue-600 text-sm hover:underline">
          See more
        </a>
      </div>

      <Slider {...settings}>
        {products.map((item, idx) => (
          <div key={idx} className="px-2">
            <div className="border rounded-md p-2 h-56 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="max-h-full mx-auto object-contain"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
