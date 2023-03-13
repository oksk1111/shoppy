import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product, // 객체 자체를 넘기든가,
  product: { id, image, title, category, price }, // 객체 내부 아이템을 개별로 넘기든가
}) {
  const navigate = useNavigate();
  return (
    <li
      className="rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:scale-105"
      onClick={() => {
        navigate(`/products/${id}`, { state: { product } });
      }}
    >
      <img className="w-full" src={image} alt={title} />
      <div className="mt-2 px-2 text-lg flex justify-between items-center">
        <h3 className="truncate">{title}</h3>
        <p>{`₩${price}`}</p>
      </div>
      <p className="mb-2 px-2 text-gray-600">{category}</p>
    </li>
  );
}
