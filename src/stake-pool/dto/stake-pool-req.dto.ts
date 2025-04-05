export class StakePoolReqDto {
  name: string;
  symbol: string;
  uri: string;
  originTokenAddress: string;
  sellerFeeBasisPoints: number;
  creators?: string;
}
