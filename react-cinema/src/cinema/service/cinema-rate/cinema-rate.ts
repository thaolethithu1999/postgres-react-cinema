import { Attributes, Filter, Service } from 'onecore';

export interface CinemaRate {
  id: string;
  userId: string;
  rate: number;
  rateTime?: Date;
  review?: string;
}

export interface CinemaRateService extends Service<CinemaRate, string, CinemaRateFilter>{
  getCinemaByCinemaId(id: string): Promise<CinemaRate[]>;
}

export class CinemaRateFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  id?: string;
  userId?: string;
  rate?: number;
  rateTime?: Date;
  review?: string;
  limit?: number;
}

export const cinemaRateModel: Attributes = {
  id: { 
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  rate: {
    required: true,
    q: true,
    type: 'number'
  },
  rateTime: {
    type: 'datetime'
  },
  review: {
    q: true
  }
}