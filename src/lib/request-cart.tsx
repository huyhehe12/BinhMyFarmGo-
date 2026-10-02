import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  addItem: (slug: string, name: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "binh-my-farmgo-yeu-cau";

const CartContext = createContext<CartContextValue | null>(null);

export function RequestCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      /* bỏ qua dữ liệu tạm không đọc được */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* bỏ qua khi không lưu được */
    }
  }, [items]);

  const addItem = useCallback((slug: string, name: string, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.slug === slug);
      if (existing) {
        return current.map((i) =>
          i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...current, { slug, name, quantity }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((current) =>
      current
        .map((i) => (i.slug === slug ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((current) => current.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useRequestCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useRequestCart phải được dùng trong RequestCartProvider");
  }
  return ctx;
}
