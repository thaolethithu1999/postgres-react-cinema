import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Appreciation, UsefulAppreciation } from '../appreciation/appreciation';
import { appreciationModel, AppreciationReply, AppreciationReplyFilter, AppreciationReplyService, Result } from './appreciation-reply';

export * from './appreciation-reply';

export class AppreciationReplyClient extends Client<AppreciationReply, string, AppreciationReplyFilter> implements AppreciationReplyService {
  constructor(http: HttpRequest, public url: string) {
    super(http, url, appreciationModel);
    this.searchGet = true;
  }
  insertReply(obj: Appreciation): Promise<Result<Appreciation>> {
    const url = this.serviceUrl;
    return this.http.post<Result<Appreciation>>(url, obj);
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
