import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';

import { RateClient, rateModel, RateService } from './rate';

const httpRequest = new HttpRequest(axios, options);

export interface Config {
    rate_url: string;
};

class ApplicationContext {
    rateService?: RateService;

    constructor() {
        this.getConfig = this.getConfig.bind(this);
        this.getRateService = this.getRateService.bind(this);
    }

    getConfig(): Config {
        return storage.config();
    }

    getRateService(): RateService {
        if (!this.rateService) {
            const c = this.getConfig();
            console.log(c);
            
            this.rateService = new RateClient(httpRequest, c.rate_url);
        }
        return this.rateService;
    }
}

export const context = new ApplicationContext();

export function useRate(): RateService {
    return context.getRateService();
}
