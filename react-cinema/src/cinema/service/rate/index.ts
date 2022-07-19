import { HttpRequest } from 'axios-core';
import { log } from 'console';
import { Client } from 'web-clients';
import { Rate, RateFilter, RateService, rateModel, Reply, ReplyService, ReplyFilter, replyModel } from './rate';

export * from './rate';

export class RateClient extends Client<Rate, string, RateFilter> implements RateService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, rateModel);
    this.searchGet = true;
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.getRate = this.getRate.bind(this);
    this.updateRate = this.updateRate.bind(this);
    this.reply = this.reply.bind(this);
    this.removeReply = this.removeReply.bind(this);
    this.updateReply = this.updateReply.bind(this);
    this.getReplySearch = this.getReplySearch.bind(this);
  }

  rate(obj: Rate): Promise<any> {
    const url = this.serviceUrl;
    return this.http.post(url, obj);
  }
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/useful/${id}/${author}/${userId}`;
    return this.http.post(url, ctx);
  }
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/useful/${id}/${author}/${userId}`;
    return this.http.delete(url);
  }
  getRate(obj: Rate, ctx?: any): Promise<Rate[]> {
    const url = `${this.serviceUrl}/search`;
    return this.http.post(url, ctx);
  }
  updateRate(rate: Rate, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/${rate.id}/${rate.author}`;
    return this.http.put(url, ctx);
  }
  reply(reply: Reply, ctx?: any): Promise<boolean> {
    const url = `${this.serviceUrl}/reply/${reply.id}/${reply.author}/${reply.userId}`;
    return this.http.post(url, reply, ctx);
  }
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/reply/${id}/${author}/${userId}`;
    return this.http.delete(url, ctx);
  }
  updateReply(reply: Reply, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/reply/${reply.id}/${reply.author}/${reply.userId}`;
    return this.http.put(url, reply, ctx);
  }
  getReplySearch(obj: Rate, ctx?: any): Promise<Reply[]> {
    const url = `${this.serviceUrl}/reply/search`;
    return this.http.post(url, obj, ctx);
  }

}

export class ReplyClient extends Client<Reply, string, ReplyFilter> implements ReplyService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, replyModel);
  }
}
