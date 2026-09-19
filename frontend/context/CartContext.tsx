"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Course } from "@/data/courses";

type CartContextType = {
  items: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Course[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("nailcourse-cart");

    if (savedCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "nailcourse-cart",
      JSON.stringify(items)
    );
  }, [items]);

  const addToCart = (course: Course) => {
    setItems((current) => {
      if (current.some((item) => item.id === course.id)) {
        return current;
      }

      return [...current, course];
    });
  };

  const removeFromCart = (courseId: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== courseId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: string) => {
    return items.some((item) => item.id === courseId);
  };

  const totalPrice = items.reduce(
    (total, item) => total + item.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}