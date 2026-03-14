import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { useCartStore } from "../../store/useCartStore";
import { Button } from "../../components/ui/button";
import type { Customer } from "../../types/customer";
import CustomerDrawer from "../../components/sub-components/customerList";
import { useOrder } from "../../api/queries/useOrder";
import type { Term } from "../../types/auth";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CheckoutPage = () => {
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const {
    productTerms,
    billTerms,
    // isTermsLoading,
    placeOrder,
  } = useOrder("Sales");
  const [formData, setFormData] = useState({
    id: 0,
    customerName: "",
    panNumber: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  // Financial Constants
  const vatRate = 13;
  const subTotal = cart.reduce(
    (acc, item) => acc + item.Price * item.Quantity,
    0,
  );
  const totalVat = subTotal * (vatRate / 100);
  const netTotal = subTotal + totalVat;
  const handleCustomerSelect = (customer: Customer) => {
    setFormData((prev) => ({
      ...prev,
      id: customer.LedgerId,
      customerName: customer.GlPrintingName,
      panNumber: customer.PanNo,
      address: customer.Address,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "customerName" ? { id: 0 } : {}),
    }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString();

    const details: OrderDetail[] = cart.map((item, index) => {
      const itemBasic = item.Price * item.Quantity;
      const itemVat = 0;
      return {
        VoucherNo: "",
        SNo: index + 1,
        ProductDesc: item.ProductName,
        ProductId: item.ProductId,
        AltQty: 0,
        AltUnit: null,
        Qty: item.Quantity,
        Unit: item.ProductUnit,
        // List api ProductUnit
        QtyConv: 0,
        AltQtyConv: 0,
        GodownId: 0,
        GodownDesc: "",
        Rate: item.Price,
        BasicAmount: itemBasic,
        TermAmount: itemVat,
        IsTaxable: item.isTaxable,
        TaxableAmount: item.isTaxable ? itemBasic : 0,
        TaxFreeAmount: item.isTaxable ? 0 : itemBasic,
        NetAmount: itemBasic + itemVat,
        TermDetails: "",
        UnitId: item.ProductUnitID,
        AltUnitId: 0,
        ProductGrpId: 0,
        PTermDetails:
          productTerms?.data.map((term: Term) => ({
            VoucherNo: "",
            Sno: index + 1,
            ProductId: item.ProductId,
            Qty: item.Quantity,
            TermId: term.TermId,
            TermType: term.TermType,
            TermDesc: term.TermDesc,
            StSign: term.Sign,
            TermRate: term.Rate,
            TermAmt: itemVat,
            BasicAmount: itemBasic,
            TermDetails: "",
            TaxableAmt: item.isTaxable ? itemBasic : 0,
            LocalTermAmt: itemVat,
          })) || [],
      };
    });

    // sum of detail istaxable true
    const taxable = details.reduce(
      (acc, num) => (num.IsTaxable ? acc + num.NetAmount : 0),
      0,
    );
    const taxfree = details.reduce(
      (acc, num) => (num.IsTaxable ? 0 : acc + num.NetAmount),
      0,
    );

    const finalPayload: SalesOrderPayload = {
      VoucherNo: "",
      DocId: 0,
      VMiti: "",
      VDate: today,
      OrderNo: "",
      ChallanNo: "",
      LedgerDesc: formData.customerName,
      LedgerId: formData.id,
      ReferenceNo: "",
      ReferenceDate: null,
      ReferenceMiti: "",
      DueDay: 0,
      DueDate: null,
      DueMiti: "",
      DepartmentDesc1: "",
      DepartmentId1: 0,
      CurrencyId: 0,
      CurrencyDesc: "",
      CurrencyRate: 1,
      SalesManId: Number(localStorage.getItem("salesManID")),
      SalesManDesc: "",
      SubLedgerId: 0,
      SubLedgerDesc: null,
      Remarks: "Acme Store",
      TermDetailsStringValue: "",
      ProductSerialNo: "",
      BasicAmount: subTotal,
      TermAmount: totalVat,
      NetAmount: netTotal,
      LocalNetAmount: netTotal,
      TaxableAmount: taxable,
      TaxFreeAmount: taxfree,
      VatAmount: totalVat,
      PartyLedgerId: formData.id,
      PartyName: formData.customerName,
      PartyVatNo: formData.panNumber,
      PartyAddress: formData.address,
      PartyMobileNo: formData.phoneNumber,
      PartyEmail: formData.email,
      ChequeNo: "",
      ChequeDate: null,
      ChequeMiti: "",
      PaymentType: formData.id === 0 ? "cash" : "credit",
      QuotationNo: "",
      InvoiceType: "Local",
      Details: details,
      MasterTerm:
        billTerms?.data.map((term: Term, index: number) => ({
          VoucherNo: "",
          Sno: index + 1,
          ProductId: 0,
          Qty: 0,
          TermId: term.TermId,
          TermType: term.TermType,
          TermDesc: term.TermDesc,
          StSign: term.Sign,
          TermRate: term.Rate,
          TermAmt: 0,
          BasicAmount: 0,
          TermDetails: "",
          TaxableAmt:  0,
          LocalTermAmt: 0,
        })) || [],
    };

    // Execute the mutation from useOrder hook
    placeOrder(finalPayload);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F8F7]">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4">
          Registry is Empty
        </h2>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="rounded-2xl"
        >
          Return to Catalog
        </Button>
      </div>
    );
  }

  const hasVisibleTerms = billTerms?.data?.some((t) => t.Rate > 0);
  return (
    <div className="bg-[#F8F8F7] min-h-screen text-zinc-900 antialiased pb-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 pb-12">
          <div className="space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-900 transition-all"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Browsing
            </button>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.8]">
              Checkout
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Registry Verification
            </span>
            <CustomerDrawer onSelect={handleCustomerSelect} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-12">
              <input type="hidden" name="id" value={formData.id} />

              <section className="bg-white p-8 rounded-[32px] border border-zinc-100/50 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                  <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black">
                    01
                  </span>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900">
                    Entity Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField
                    label="Customer Full Name"
                    name="customerName"
                    placeholder="Legal Name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    label="PAN / VAT Number"
                    name="panNumber"
                    placeholder="Registry ID"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </section>

              <section className="bg-white p-8 rounded-[32px] border border-zinc-100/50 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                  <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black">
                    02
                  </span>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900">
                    Logistics Detail
                  </h3>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      Shipping Address
                    </label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, City, Province"
                      className="w-full bg-white border border-zinc-200 rounded-[24px] p-6 text-[13px] font-semibold focus:outline-none focus:border-zinc-900 transition-colors min-h-[140px] resize-none shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField
                      label="Phone Contact"
                      name="phoneNumber"
                      placeholder="+977"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Email Confirmation"
                      name="email"
                      placeholder="name@domain.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </section>

              <Button
                type="submit"
                // disabled={isPlacing}
                className="w-full h-20 bg-zinc-900 text-white rounded-[28px] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-zinc-800 transition-all mt-12 transform active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {/* {isPlacing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  `Confirm and Place Order — Rs. ${netTotal.toLocaleString()}`
                )} */}
                Place order
              </Button>
            </form>
          </div>

          <aside className="lg:col-span-5 sticky top-12">
            <div className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-[0_30px_90px_rgba(0,0,0,0.03)] flex flex-col min-h-[600px]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-10">
                Order Summary
              </h3>
              <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div
                    key={item.ProductId}
                    className="flex gap-5 items-center group"
                  >
                    <div className="w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-50">
                      <img
                        src={item.Image}
                        onError={(e) =>
                          (e.currentTarget.src = `https://placehold.co/600x800?text=${item.ProductName}`)
                        }
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-black uppercase leading-tight text-zinc-900">
                        {item.ProductName}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter mt-1">
                        {item.Quantity} × Rs. {item.Price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 space-y-4 pt-10 border-t border-zinc-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-t border-zinc-800 pt-4 mt-4">
                  <div className="flex flex-col gap-3 w-full">
                    {hasVisibleTerms && (
                      <div className="w-full flex flex-col gap-3">
                        <div className="flex justify-between items-end  pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                            Terms
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                            Rate
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {billTerms?.data.map(
                            (term: Term) =>
                              term.Rate > 0 && (
                                <div
                                  key={term.TermId}
                                  className="flex items-center"
                                >
                                  <p className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">
                                    {term.TermDesc}
                                  </p>
                                  <div className="mx-2 flex-grow border-b border-dotted border-zinc-700/50 mb-1" />
                                  <p className="text-[11px] text-zinc-300 font-mono">
                                    {term.Rate}%
                                  </p>
                                </div>
                              ),
                          )}

                          {/* {productTerms?.data.map(
                            (term: Term) =>
                              term.Rate > 0 && (
                                <div
                                  key={term.TermId}
                                  className="flex items-center"
                                >
                                  <p className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">
                                    {term.TermDesc}
                                  </p>
                                  <div className="mx-2 flex-grow border-b border-dotted border-zinc-700/50 mb-1" />
                                  <p className="text-[11px] text-zinc-300 font-mono">
                                    {term.Rate}%
                                  </p>
                                </div>
                              ),
                          )} */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">
                    Final Total
                  </span>
                  <span className="text-3xl font-black tracking-tighter leading-none text-zinc-900">
                    Rs. {netTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }: InputFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="h-16 px-6 bg-white border border-zinc-200 rounded-[20px] text-[13px] font-semibold focus:outline-none focus:border-zinc-900 transition-colors"
    />
  </div>
);

export default CheckoutPage;

/* --- Types --- */

interface PTermDetail {
  VoucherNo: string;
  Sno: number;
  ProductId: number;
  Qty: number;
  TermId: number;
  TermType: string;
  TermDesc: string;
  StSign: string;
  TermRate: number;
  TermAmt: number;
  BasicAmount: number;
  TermDetails: string;
  TaxableAmt: number;
  LocalTermAmt: number;
}

interface OrderDetail {
  VoucherNo: string;
  SNo: number;
  ProductDesc: string;
  ProductId: number;
  AltQty: number;
  AltUnit: string | null;
  Qty: number;
  Unit: string;
  QtyConv: number;
  AltQtyConv: number;
  GodownId: number;
  GodownDesc: string;
  Rate: number;
  BasicAmount: number;
  TermAmount: number;
  IsTaxable: boolean;
  TaxableAmount: number;
  TaxFreeAmount: number;
  NetAmount: number;
  TermDetails: string;
  UnitId: number;
  AltUnitId: number;
  ProductGrpId: number;
  PTermDetails: PTermDetail[];
}

interface MasterTerm {
  VoucherNo: string;
  Sno: number;
  ProductId: number;
  Qty: number;
  TermId: number;
  TermType: string;
  TermDesc: string;
  StSign: string;
  TermRate: number;
  TermAmt: number;
  BasicAmount: number;
  TermDetails: string;
  TaxableAmt: number;
  LocalTermAmt: number;
}

export interface SalesOrderPayload {
  VoucherNo: string;
  DocId: number;
  VMiti: string;
  VDate: string | null;
  OrderNo: string;
  ChallanNo: string;
  LedgerDesc: string;
  LedgerId: number;
  ReferenceNo: string;
  ReferenceDate: string | null;
  ReferenceMiti: string;
  DueDay: number | null;
  DueDate: string | null;
  DueMiti: string;
  DepartmentDesc1: string;
  DepartmentId1: number;
  CurrencyId: number;
  CurrencyDesc: string;
  CurrencyRate: number;
  SalesManId: number;
  SalesManDesc: string;
  SubLedgerId: number;
  SubLedgerDesc: string | null;
  Remarks: string;
  TermDetailsStringValue: string;
  ProductSerialNo: string;
  BasicAmount: number;
  TermAmount: number;
  NetAmount: number;
  LocalNetAmount: number;
  TaxableAmount: number;
  TaxFreeAmount: number;
  VatAmount: number;
  PartyLedgerId: number;
  PartyName: string;
  PartyVatNo: string;
  PartyAddress: string;
  PartyMobileNo: string;
  PartyEmail: string;
  ChequeNo: string;
  ChequeDate: string | null;
  ChequeMiti: string;
  PaymentType: string;
  QuotationNo: string;
  InvoiceType: string;
  Details: OrderDetail[];
  MasterTerm: MasterTerm[];
  // ... adding other optional fields as null/0 for compliance
}
