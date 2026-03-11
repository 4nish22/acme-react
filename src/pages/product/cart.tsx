import { useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";

const CartDrawer = () => {
  const { cart, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.Price * item.Quantity,
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.Quantity, 0);

  // Simplified: Just close the drawer and move to the form page
  const handleProceedToCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
    window.scrollTo(0, 0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-3 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-all group active:scale-95 shadow-none">
          <ShoppingCart size={20} strokeWidth={1.5} className="text-zinc-900" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in tracking-tighter">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md bg-[#F8F8F7] p-0 flex flex-col border-l border-zinc-200">
        <SheetHeader className="p-8 bg-white border-b border-zinc-100">
          <SheetTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Shopping Bag / {totalItems} Units
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <ShoppingCart size={40} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Bag is Empty
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.ProductId}
                className="bg-white p-4 rounded-[24px] border border-white shadow-sm flex gap-4 group transition-all"
              >
                <div className="w-20 h-24 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.Image}
                    className="w-full h-full object-cover mix-blend-multiply"
                    alt={item.ProductName}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[11px] font-black uppercase leading-tight max-w-[140px]">
                        {item.ProductName}
                      </h4>
                      <p className="text-[9px] font-bold text-zinc-500 mt-1 uppercase tracking-tighter">
                        ID: {item.ProductId}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.ProductId)}
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-4 bg-zinc-50 rounded-lg p-1 border border-zinc-100">
                      <button
                        onClick={() => updateQuantity(item.ProductId, item.Quantity - 1)}
                        className="p-1 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-[10px] font-bold w-4 text-center">
                        {item.Quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.ProductId, item.Quantity + 1)}
                        className="p-1 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-xs font-black tracking-tighter">
                      Rs. {(item.Price * item.Quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-8 border-t border-zinc-100 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span>Subtotal</span>
              <span className="text-zinc-900">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-[11px] font-black uppercase tracking-widest">
                Total
              </span>
              <span className="text-2xl font-black tracking-tighter">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            onClick={handleProceedToCheckout}
            disabled={cart.length === 0}
            className="w-full h-16 rounded-2xl bg-zinc-900 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <div className="flex items-center gap-2">
              Proceed to Checkout <ArrowRight size={14} />
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;