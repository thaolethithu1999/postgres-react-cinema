import { Attributes, Filter, Search, Service } from 'onecore';
import { Repository } from 'query-core';

export interface Rate {
  id: string;
  userid: string;
  rate: number;
  ratetime?: Date;
  review?: string;
}

export interface RateFilter extends Filter {
  id?: string;
  userid?: string;
  rate?: number;
  ratetime?: Date;
  review?: string;
}

export interface RateRepository extends Repository<Rate, string> {
  searchRate(rate: RateFilter): Promise<Rate | null>;
  updateRate(rate: RateFilter): Promise<boolean>;
};

export interface RateService extends Service<Rate, string, RateFilter> {
  searchRate(rate: RateFilter): Promise<Rate | null>;
  updateRate(rate: RateFilter): Promise<boolean>;
}

export const rateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userid: {
    key: true,
    required: true
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 5
  },
  ratetime: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
}