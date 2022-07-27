import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Rate, RateFilter, RateService, rateModel } from './rate';

export * from './rate';

export class RateClient extends Client<Rate, string, RateFilter> implements RateService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, rateModel);
    this.searchGet = true;
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
  }

  rate(obj: Rate): Promise<any> {
    const url = this.serviceUrl;
    return this.http.post(url, obj);
  }

  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/useful/${id}/${author}/${userId}`;
    return this.http.post(url, ctx);
  }

  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>{
    const url = `${this.serviceUrl}/useful/${id}/${author}/${userId}`;
    return this.http.delete(url);
  }

  getRate(obj: Rate, ctx?: any): Promise<Rate[]>{
    const url = `${this.serviceUrl}/search`;
    return this.http.post(url, ctx);
  }

}

