export interface LstMeta extends Record<string, string> {}

export interface LstPool {
  pool: string;
  program: string;
  validator_list: string;
  vote_account?: string;
}

export interface Lst {
  decimals: number;
  logo_uri: string;
  meta?: LstMeta;
  mint: string;
  name: string;
  pool: LstPool;
  symbol: string;
  token_program: string;
}

export interface LstResponse {
  lsts: Lst[];
}