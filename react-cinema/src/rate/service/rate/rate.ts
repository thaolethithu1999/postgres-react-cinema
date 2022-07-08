import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface RateId {
  id: string;
  userId: string;
}

export interface Rate extends Tracking {
    id?: string;
    userId?: string;
    rate?: number;
    rateTime?: Date;
    review?: string;
    usefulCount?: number;
    isUseful?: boolean;
}

export class RateFilter implements Filter {
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
  usefulCount?: number;
  limit?: number;
}

export interface UsefulRateId {
  id: string;
  userId: string;
  author: string;
}

export interface UsefulRate {
  id: string;
  userId: string;
  author: string;
  reviewTime: Date;
}

export interface UsefulRateFilter extends Filter {
  id?: string;
  userId?: string;
  author?: string;
  reviewTime?: Date;
}

export interface RateService extends Service<Rate, string , RateFilter>{
 // getRate(id: string, userId: string): Promise<Rate[]>;
  rate(obj: Rate): Promise<any>;
  setUseful(id: string, userId: string, author: string, ctx?: any): Promise<number>;
  removeUseful(id: string, userId: string, author: string, ctx?: any): Promise<number>;

}

export const rateModel: Attributes = {
    d: {
        key: true,
        required: true
    },
    userId: {
        key: true,
        required: true
    },
    rate: {
        type: 'integer',
        min: 1,
        max: 5
    },
    rateTime: {
        type: 'datetime',
    },
    review: {
        q: true,
    },
    usefulCount: {
      type: 'integer'
    }
}

export const usefulRateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  reviewTime: {
    type: 'datetime',
  },
}