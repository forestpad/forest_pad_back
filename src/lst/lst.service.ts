import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { LstResponse } from './lst.types';

@Injectable()
export class LstService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly httpService: HttpService
  ) {}

  async getLsts(): Promise<LstResponse> {
    try {
      const cachedData = await this.cacheManager.get<LstResponse>('lsts');
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch the data from Sanctum API
      const response = await this.httpService.get<LstResponse>('https://extra-api.sanctum.so/v1/lsts').toPromise();
      if (!response) {
        throw new InternalServerErrorException('Failed to fetch LST data');
      }

      const lsts = response.data;
      await this.cacheManager.set('lsts', lsts);
      return lsts;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch LST data: ' + error.message);
    }
  }
}