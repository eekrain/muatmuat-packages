import { useEffect, useRef, useState } from "react";

import { Minus, Plus } from "lucide-react";

export default function QuantityInput({
  maxStock = 5,
  minQuantity = 1,
  initialValue = 1,
  onChange,
}) {
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    // Ensure initial value is within bounds
    const boundedInitialValue = Math.max(
      minQuantity,
      Math.min(initialValue, maxStock)
    );
    setQuantity(boundedInitialValue);
  }, [initialValue, minQuantity, maxStock]);

  const prevQuantityRef = useRef();

  useEffect(() => {
    if (prevQuantityRef.current !== quantity) {
      onChange(quantity);
    }
    prevQuantityRef.current = quantity;
  }, [quantity, onChange]);

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (value < minQuantity) {
        setQuantity(minQuantity);
      } else if (value > maxStock) {
        setQuantity(maxStock);
      } else {
        setQuantity(value);
      }
    }
  };

  return (
    <div className="flex items-start whitespace-nowrap text-center text-xs font-medium leading-tight text-black">
      <div className="flex min-h-[32px] w-[110px] items-center gap-2 rounded-md border border-solid border-neutral-500 bg-white px-3 py-2 hover:border-primary-700">
        <button
          onClick={handleDecrement}
          disabled={quantity <= minQuantity}
          aria-label="Decrease quantity"
          className={`my-auto aspect-square w-4 shrink-0 self-stretch object-contain ${
            quantity <= minQuantity
              ? "cursor-not-allowed opacity-50"
              : "hover:text-primary-700"
          }`}
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxStock}
          aria-label="Quantity"
          className="my-auto flex-1 shrink basis-0 self-stretch text-center focus:outline-none"
        />
        <button
          onClick={handleIncrement}
          disabled={quantity >= maxStock}
          aria-label="Increase quantity"
          className={`my-auto aspect-square w-4 shrink-0 self-stretch object-contain ${
            quantity >= maxStock
              ? "cursor-not-allowed opacity-50"
              : "hover:text-primary-700"
          }`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
