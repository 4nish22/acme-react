export interface Product {
  IndexNo: number;
  ProductId: number;
  ProductDesc: string;
  ProductPrintingName: string;
  HsCode: string;
  ProductShortName: string;
  BarCodeNo1: string | null;
  ProductCategory: string;
  ProductType: string;
  QtyConv: number;
  AltConv: number;
  SalesRate: number;
  MenuRate: number;
  TradeRate: number;
  WholesaleRate: number;
  BuyRate: number;
  MRP: number;
  IsBatchwise: boolean;
  Isserialwise: boolean;
  IsTaxable: boolean;
  ProductGrpDesc: string;
  ProductSubGrpDesc: string;
  ProductGrp1Desc: string;
  ProductGrp2Desc: string;
  ProductUnitId: number;
  ProductUnit: string;
  ProductAltUnitId: number | null;
  ProductAltUnit: string | null;
  AltStockQty: number;
  StockQty: number;

  image?: string;
}
export interface ProductListResponse {
  products: Product[];
  totalRecords: number;
}

export interface ProductGroup {
  ProductGrpId: number;
  ProductGrpDesc: string;
}

export interface FilterSidebarProps {
  groups: ProductGroup[];
  tags: ProductGroup[];
  isLoading?: boolean;
}
