export interface Customer {
  IndexNo: number;
  LedgerId: number;
  GlShortName: string;       
  GlDesc: string;             
  GlPrintingName: string;      
  GlAlias: string;            
  GlCategory: string;          
  AccountGrpDesc: string;     
  AccountSubGrpDesc: string | null;
  SalesmanDesc: string;        
  AreaDesc: string;           
  PanNo: string;              
  Address: string;             
  Address1: string;           
  City: string | null;
  CreditDays: number;         
}


export interface CustomerListResponse {
 
  customers: Customer[];
  totalRecords: number;
}