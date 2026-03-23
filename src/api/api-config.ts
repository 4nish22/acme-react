export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    CHECK_SESSION: "/api/auth/checksession",
  },
  COMPANY: {
    LIST: "/api/company/list",
    SELECT_COMPANY: (initial: string) =>
      `/api/company/select?initial=${initial} `,
  },

  PRODUCT: {
    LIST: "/api/common/picklist/productlist",
    DETAILS: (id: string | number) =>
      `/api/master/productmaster/listproduct?Context=${id}&Take=1`,
    GROUP: "/api/master/ProductGroup/ListProductGroup",
    GROUP1:
      "/api/master/ProductTag/ListProductGroupTag?groupName=ProductGroup1",
    EXPORT: "/api/DocumentExport/Products",
  },

  CUSTOMER: {
    LIST: "/api/common/picklist/ledgerlist",
  },
  ORDER: {
    POST: "/api/transaction/salesorder/new",
    LIST_TERM: "/api/common/term",
  },
} as const;
