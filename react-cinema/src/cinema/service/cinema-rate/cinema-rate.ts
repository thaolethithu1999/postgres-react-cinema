import { Attributes, Filter, Service } from 'onecore';

export interface CinemaRate {
  id: string;
  userid: string;
  rate: number;
  ratetime?: Date;
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
  userid?: string;
  rate?: number;
  ratetime?: Date;
  review?: string;
  limit?: number;
}

export const cinemaRateModel: Attributes = {
  id: { 
    key: true,
    required: true
  },
  userid: {
    key: true,
    required: true
  },
  rate: {
    required: true,
    q: true,
    type: 'number'
  },
  ratetime: {
    type: 'datetime'
  },
  review: {
    q: true
  }
}