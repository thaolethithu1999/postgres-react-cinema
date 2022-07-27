import { HttpRequest } from 'axios-core';
import { Client } from 'web-clients';
import { Rate, RateFilter, RateService, rateModel,RateComment, RateCommentFilter, RateCommentService, rateCommentModel } from './rate';

export * from './rate';

export class RateClient extends Client<Rate, string, RateFilter> implements RateService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, rateModel);
    this.searchGet = true;
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.getRate = this.getRate.bind(this);
    this.updateRate = this.updateRate.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.getCommentSearch = this.getCommentSearch.bind(this);
  }

  rate(obj: Rate): Promise<any> {
    const url = `${this.serviceUrl}` ;
    console.log(url);
    
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
  comment(comment: RateComment, ctx?: any): Promise<boolean> {
    const url = `${this.serviceUrl}/comment/${comment.id}/${comment.author}/${comment.userId}`;
    return this.http.post(url, comment, ctx);
  }
  removeComment(commentId: string, author: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/comment/${commentId}/${author}`;
    return this.http.delete(url, ctx);
  }
  updateComment(comment: RateComment, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/comment/${comment.commentId}/${comment.id}/${comment.author}/${comment.userId}`;
    return this.http.put(url, {comment: comment.comment}, ctx);
  }
  getCommentSearch(obj: Rate, ctx?: any): Promise<RateComment[]> {
    const url = `${this.serviceUrl}/comment/search`;
    return this.http.post(url, obj, ctx);
  }
}
export class RateCommentClient extends Client<RateComment, string, RateCommentFilter> implements RateCommentService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, rateCommentModel);
  }
}
