import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface RateId {
  id: string;
  author: string;
}

export interface Rate extends Tracking {
  id?: string;
  author?: string;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
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
  author?: string;
  disable?: boolean;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  limit?: number;
}

export interface UsefulRateId {
  id: string;
  author: string;
  userId: string;
}

export interface UsefulRate {
  id: string;
  author: string;
  userId: string;
  reviewTime: Date;
}

export interface UsefulRateFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  reviewTime?: Date;
}

export interface RateService extends Service<Rate, string, RateFilter> {
  getRate(obj: Rate): Promise<Rate[]>;
  rate(obj: Rate): Promise<any>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;

}

export const rateModel: Attributes = {
  d: {
    key: true,
    required: true
  },
  author: {
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
  author: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  reviewTime: {
    type: 'datetime',
  },
}