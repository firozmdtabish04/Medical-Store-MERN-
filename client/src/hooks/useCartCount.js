import { useState, useEffect, useCallback } from "react";

export const CART_UPDATED_EVENT = "medifind_cart_updated";

export const dispatchCartUpdate = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const getStoredCartCount = () => {
  try {
    const raw = localStorage.getItem("medifind_cart");
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce(
      (total, item) => total + (Number(item?.quantity) || 1),
      0,
    );
  } catch {
    return 0;
  }
};

export function useCartCount() {
  const [cartCount, setCartCount] = useState(() => getStoredCartCount());

  const syncCount = useCallback(() => {
    setCartCount(getStoredCartCount());
  }, []);

  useEffect(() => {
    syncCount();

    const handleStorage = (e) => {
      if (e.key === "medifind_cart" || !e.key) {
        syncCount();
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, syncCount);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCount);
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncCount]);

  return { cartCount, syncCount };
}
