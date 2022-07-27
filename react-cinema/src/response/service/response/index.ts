import { HttpRequest } from "axios-core";
import { Client } from "web-clients";
import {
  Response,
  ResponseFilter,
  ResponseService,
  responseModel,
  ResponseComment,
  ResponseCommentFilter,
  ResponseCommentService,
  responseCommentModel,
} from "./response";

export * from "./response";

export class ResponseClient
  extends Client<Response, string, ResponseFilter>
  implements ResponseService
{
  constructor(http: HttpRequest, url: string) {
    super(http, url, responseModel);
    this.searchGet = false;
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.getResponse = this.getResponse.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.getCommentSearch = this.getCommentSearch.bind(this);
  }
  
  postOnly(s: ResponseFilter): boolean {
    return true;
  }

  response(obj: Response): Promise<any> {
    const url = this.serviceUrl;
    return this.http.post(url, obj);
  }
  setUseful(
    id: string,
    author: string,
    userId: string,
    ctx?: any
  ): Promise<number> {
    const url = `${this.serviceUrl}/useful/${id}/${author}/${userId}`;
    return this.http.post(url, ctx);
  }
  removeUseful(
    id: string,
    author: string,
    userId: string,
    ctx?: any
  ): Promise<number> {
    const url = `${this.serviceUrl}/useful/${id}/${author}/${userId}`;
    return this.http.delete(url);
  }
  getResponse(obj: Response, ctx?: any): Promise<Response[]> {
    const url = `${this.serviceUrl}/search`;
    return this.http.post(url, ctx);
  }
  updateResponse(response: Response, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/${response.id}/${response.author}`;
    return this.http.put(url, ctx);
  }
  comment(comment: ResponseComment, ctx?: any): Promise<boolean> {
    const url = `${this.serviceUrl}/comment/${comment.id}/${comment.author}/${comment.userId}`;
    return this.http.post(url, comment, ctx);
  }
  removeComment(commentId: string, author: string, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/comment/${commentId}/${author}`;
    return this.http.delete(url, ctx);
  }
  updateComment(comment: ResponseComment, ctx?: any): Promise<number> {
    const url = `${this.serviceUrl}/comment/${comment.commentId}/${comment.id}/${comment.author}/${comment.userId}`;
    return this.http.put(url, { comment: comment.comment }, ctx);
  }
  getCommentSearch(obj: Response, ctx?: any): Promise<ResponseComment[]> {
    const url = `${this.serviceUrl}/comment/search`;
    return this.http.post(url, obj, ctx);
  }
}
export class ResponseCommentClient
  extends Client<ResponseComment, string, ResponseCommentFilter>
  implements ResponseCommentService
{
  constructor(http: HttpRequest, url: string) {
    super(http, url, responseCommentModel);
  }
}
