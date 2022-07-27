import axios from "axios";
import { HttpRequest } from "axios-core";
import { options, storage } from "uione";

import {
  ResponseClient,
  ResponseService,
  ResponseCommentClient,
  ResponseCommentService,
} from "./response";

export * from "./response";

const httpRequest = new HttpRequest(axios, options);

export interface Config {
  response_url: string;
  response_comment_url: string;
}

class ApplicationContext {
  responseService?: ResponseService;
  responseCommentService?: ResponseCommentService;

  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getResponseService = this.getResponseService.bind(this);
  }

  getConfig(): Config {
    return storage.config();
  }

  getResponseService(): ResponseService {
    if (!this.responseService) {
      const c = this.getConfig();
      this.responseService = new ResponseClient(httpRequest, c.response_url);
    }
    return this.responseService;
  }

  getResponseCommentService(): ResponseCommentService {
    if (!this.responseCommentService) {
      const c = this.getConfig();
      this.responseCommentService = new ResponseCommentClient(
        httpRequest,
        c.response_comment_url
      );
    }
    return this.responseCommentService;
  }
}

export const context = new ApplicationContext();

export function useResponse(): ResponseService {
  return context.getResponseService();
}

export function useResponseComment(): ResponseCommentService {
    return context.getResponseCommentService();
  }