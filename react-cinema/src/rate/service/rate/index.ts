import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';

import { Rate, RateFilter, RateService, rateModel } from './rate';

export * from './rate';

export class RateClient extends Client<Rate, string, RateFilter> implements RateService {
    constructor(http: HttpRequest, url: string) {
        super(http, url);
    }

    protected postOnly(s: Rate): boolean {
        return true;
    }
}