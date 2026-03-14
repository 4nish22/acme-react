export interface Login {
  username: string;
  password: string;
  rememberMe: boolean;
}


export interface Term {
  TermId: number;
  TermDesc: string;
  GlDesc: string;
  TermType: string;
  Basis: string;
  Sign: string;
  Rate: number;
}

export interface API_RESPONSE {
  status: number;
  Message: string;
  data: Term[];
}
