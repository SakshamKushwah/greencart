import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } =
    useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category.toLowerCase()}/${product._id}`
          );
          scrollTo(0, 0);
        }}
        className="border border-gray-200 rounded-md p-3 bg-white w-full cursor-pointer hover:shadow-md transition"
      >
        {/* Product Image */}
        <div className="flex items-center justify-center">
          <img
            className="group-hover:scale-105 transition w-full max-h-40 object-contain"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="mt-2 text-gray-500/80 text-sm">
          <p className="capitalize">{product.category}</p>
          <p className="text-gray-800 font-medium text-lg truncate">
            {product.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3.5 md:w-4"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <p className="text-xs text-gray-500">(4)</p>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-end justify-between mt-3">
            <p className="md:text-lg text-base font-semibold text-primary">
              {currency} {product.offerPrice}{" "}
              <span className="text-gray-400 text-xs md:text-sm line-through">
                {currency}
                {product.price}
              </span>
            </p>

            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-primary"
            >
              {!cartItems[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 
                  w-[70px] h-[34px] rounded text-sm"
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="" className="w-4" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 w-[70px] h-[34px] bg-primary/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
