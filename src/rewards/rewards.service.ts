import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection, Transaction, Keypair } from '@solana/web3.js';

@Injectable()
export class RewardsService {
  private readonly jupiterBaseUrl = 'https://quote-api.jup.ag/v6';
  private readonly connection: Connection;

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
  }

  async swapRewards(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: number = 0.5,
    walletPublicKey: string,
    walletPrivateKey: string,
  ): Promise<string> {
    // 1. Get quote
    const quoteUrl = `${this.jupiterBaseUrl}/quote?` +
      `inputMint=${inputMint}` +
      `&outputMint=${outputMint}` +
      `&amount=${Math.floor(amount * 1e9)}` +
      `&slippageBps=${Math.floor(slippage * 100)}`;

    const quoteResponse = await firstValueFrom(
      this.httpService.get(quoteUrl)
    );
    
    if (!quoteResponse.data) {
      throw new Error('Failed to get quote from Jupiter');
    }

    // 2. Get serialized transaction
    const swapResponse = await firstValueFrom(
      this.httpService.post(`${this.jupiterBaseUrl}/swap`, {
        ...quoteResponse.data,
        userPublicKey: walletPublicKey,
      })
    );

    if (!swapResponse.data || !swapResponse.data.swapTransaction) {
      throw new Error('Failed to get swap transaction');
    }

    // 3. Deserialize and sign transaction
    const swapTransactionBuf = Buffer.from(swapResponse.data.swapTransaction, 'base64');
    const transaction = Transaction.from(swapTransactionBuf);
    
    const keypair = Keypair.fromSecretKey(
      Buffer.from(walletPrivateKey, 'base64')
    );

    // 4. Sign and send transaction
    transaction.sign(keypair);
    const signature = await this.connection.sendRawTransaction(
      transaction.serialize(),
      { skipPreflight: true }
    );

    // 5. Confirm transaction
    const confirmation = await this.connection.confirmTransaction(signature);
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    return signature;
  }
}