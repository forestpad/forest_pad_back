export class StakePoolResDto {
  msg: string;
  tokenAddress?: string;
  metadataAddress?: string;
  transactionId?: string;

  constructor(
    msg: string,
    tokenAddress?: string,
    metadataAddress?: string,
    transactionId?: string,
  ) {
    this.msg = msg;
    this.tokenAddress = tokenAddress;
    this.metadataAddress = metadataAddress;
    this.transactionId = transactionId;
  }
}
