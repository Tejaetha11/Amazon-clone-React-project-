import { useNavigate } from "react-router-dom";

export const MultiItemCard = ({ title, items, seeMoreText, seeMoreLink }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-base font-semibold mb-3">{title}</h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="cursor-pointer"
              onClick={() => navigate(`/products?brand=${item.label}`)}
            >
              <img src={item.image} alt={item.altText} className="w-full h-20 object-cover rounded mb-1" />
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      {seeMoreText && seeMoreLink && (
        <a href={seeMoreLink} className="text-xs text-blue-600 hover:underline mt-3 inline-block">
          {seeMoreText}
        </a>
      )}
    </div>
  );
};

