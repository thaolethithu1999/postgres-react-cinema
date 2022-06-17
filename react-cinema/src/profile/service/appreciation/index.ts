import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Appreciation, AppreciationFilter, appreciationModel, AppreciationService, UsefulAppreciation } from './appreciation';

export * from './appreciation';

export class AppreciationClient extends Client<Appreciation, string, AppreciationFilter> implements AppreciationService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, appreciationModel);
    this.searchGet = true;
    this.usefulAppreciation = this.usefulAppreciation.bind(this);
  }

  usefulAppreciation(obj: UsefulAppreciation): Promise<number> {
    const url = this.url + '/useful';
    return this.http.post<number>(url, obj).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
}
