import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface CartItem {
    ProductId: number;
    ProductName: string;
    Price: number;
    Image: string;
    Quantity: number;
    ProductUnit: string;
    ProductUnitID: number;
    isTaxable: boolean;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, qty: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            addToCart: (product) => set((state) => {
                const exists = state.cart.find((item) => item.ProductId === product.ProductId);
                if (exists) {
                    return {
                        cart: state.cart.map((item) =>
                            item.ProductId === product.ProductId
                                ? {...item, Quantity: item.Quantity + 1}
                                : item
                        ),
                    };
                }
                return {cart: [...state.cart, {...product, Quantity: 1}]};
            }),
            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter((item) => item.ProductId !== id),
            })),
            updateQuantity: (id, qty) => set((state) => ({
                cart: state.cart.map((item) =>
                    item.ProductId === id ? {...item, Quantity: Math.max(1, qty)} : item
                ),
            })),
            clearCart: () => set({cart: []}),
        }),
        {name: 'shopping-cart'} // Saves to localStorage automatically
    )
);