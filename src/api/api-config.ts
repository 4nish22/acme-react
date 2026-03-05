export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    CHECK_SESSION: "/api/auth/checksession",
  },
  COMPANY: {
    LIST: "/api/company/list",
    SELECT_COMPANY: (initial: string ) => `/api/company/select?initial=${initial} `,
  },
  
    PRODUCT: {
    LIST  : "/api/common/picklist/productlist",
    DETAILS: (id: string | number) => `/picklist/${id}`,
    GROUP  : "/api/master/ProductGroup/ListProductGroup",
    GROUP1  : "/api/master/ProductTag/ListProductGroupTag?groupName=ProductGroup1",
  },


 

} as const; 