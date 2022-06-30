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
  ratetime?: Date;
  review?: string;
  limit?: number;
}

export interface RateService extends Service<Rate, string , RateFilter>{
  getRateByRateId(id: string, userId: string): Promise<Rate[]>;
  
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
}