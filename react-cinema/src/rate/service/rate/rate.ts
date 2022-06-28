import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface Rate extends Tracking {
    id: string;
    userId: string;
    rate: number;
    rateTime?: Date;
    review?: string;
}

export interface RateFilter extends Filter {
    id?: string;
    userId?: string;
}

export interface RateService extends Service<Rate, string , RateFilter>{}

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