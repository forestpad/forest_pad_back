import { ApiProperty } from '@nestjs/swagger';

export class StakePoolResDto {
  @ApiProperty({
    description: 'Token creation result message',
    example: 'Token has been successfully created'
  })
  msg: string;

  @ApiProperty({
    description: 'Created token address',
    example: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    required: false
  })
  tokenAddress?: string;

  @ApiProperty({
    description: 'Created token metadata address',
    example: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    required: false
  })
  metadataAddress?: string;

  @ApiProperty({
    description: 'Token creation transaction ID',
    example: '5KtPn1LGuxhFiwjxEqHNgHxUvuVNXKyJzXTViNpVNpw4UyQM9kKyZRctFShF6WGPuQV3fq8q9E8wJEPtGP8UNYV9',
    required: false
  })
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
