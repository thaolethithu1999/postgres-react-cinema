import { HttpRequest } from 'axios-core';
import { log } from 'console';
import { Client } from 'web-clients';
import { Rate, RateFilter, RateService, rateModel } from './rate';

export * from './rate';

export class RateClient extends Client<Rate, string, RateFilter> implements RateService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, rateModel);
    this.searchGet = true;
    this.getRateByRateId = this.getRateByRateId.bind(this);
  }

  getRateByRateId(id: string, userId: string): Promise<Rate[]> {
    const url = `${this.serviceUrl}/${id}/${userId}`;
    return this.http.get(url);
  }

  protected postOnly(s: Rate): boolean {
    return true;
  }

  rate(obj: Rate): Promise<any> {
    const url = this.serviceUrl;
    return this.http.post(url, obj);
  }

  update(obj: Rate): Promise<any> {
    const url = `${this.serviceUrl}/${obj.id}/${obj.userId}`;
    return this.http.put(url, obj);
  }
}

