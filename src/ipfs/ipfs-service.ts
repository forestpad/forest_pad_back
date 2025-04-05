import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private readonly pinataJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MDMxNjI3OC03M2Q2LTQ5OGUtYWEyNi01YzYzMzk5MmU3MWQiLCJlbWFpbCI6ImFlaGRhbHM5OTAwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyODgyZTZlZDUwNjE2NWExNTk5ZiIsInNjb3BlZEtleVNlY3JldCI6IjU1MTIxMmU5MDQ1Nzc5ZWJiZDc2ODAzYjMwMDNkNWJhMDlhYjYxZTFlZDMyNjczZDY1OGFlN2ZhOTZkM2E1N2QiLCJleHAiOjE3NzUzNzIzMTV9.NOlIwiy1ouxzwizNQblX-Pc6fjUB5tC7ag6RwsQOlGo';

  // 토큰 메타데이터를 IPFS에 업로드
  async uploadTokenMetadata(
    name: string,
    symbol: string,
    description: string,
    image: string,
  ): Promise<string> {
    try {
      // IPFS에 올릴 메타데이터
      const metadata = {
        name,
        symbol,
        description,
        signature: 'forest_pad_official',
        image,
      };

      this.logger.log(
        `Uploading metadata to IPFS: ${JSON.stringify(metadata)}`,
      );

      // Pinata API를 사용하여 JSON 데이터 업로드
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.pinataJwt}`,
          },
        },
      );

      const ipfsHash = response.data.IpfsHash;
      const ipfsUri = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      this.logger.log(`Metadata uploaded to IPFS with URI: ${ipfsUri}`);
      return ipfsUri;
    } catch (error) {
      this.logger.error(`Error uploading metadata to IPFS: ${error.message}`);
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }
}
