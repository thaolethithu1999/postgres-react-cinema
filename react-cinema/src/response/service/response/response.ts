import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface ResponseId {
  id: string;
  author: string;
}

export interface Response extends Tracking {
  id?: string;
  author?: string;
  description?: string;
  time?: Date;
  usefulCount?: number;
  replyCount?: number;
}

export class ResponseFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  responseId?: string;
  id?: string;
  author?: string;
  description?: string;
  time?: Date;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  limit?: number;
}

export interface ResponseReactionId {
  id: string;
  author: string;
  userId: string;
}

export interface ResponseReaction {
  id?: string;
  author?: string;
  userId: string;
  reviewTime: Date;
  reaction: number;
}

export interface ResponseReactionFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  reviewTime?: Date;
  reaction?: number;
}

export interface ResponseService extends Service<Response, string, ResponseFilter> {
  getResponse(obj: Response): Promise<Response[]>;
  updateResponse(response: Response): Promise<number>;
  response(obj: Response): Promise<any>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  comment(comment: ResponseComment): Promise<boolean>;
  removeComment(commentId: string, author: string, ctx?: any): Promise<number>;
  updateComment(comment: ResponseComment): Promise<number>;
  getCommentSearch(obj: Response, ctx?: any): Promise<ResponseComment[]>;
}

export interface ResponseCommentService extends Service<ResponseComment, string, ResponseCommentFilter> {

}

export const responseModel: Attributes = {
  id: {
    key: true,
    required: true,
    match: 'equal'
  },
  author: {
    key: true,
    required: true,
    match: 'equal'
  },
  description: {
    type: 'string',
  },
  time: {
    type: 'datetime',
  },
  usefulCount: {
    type: 'integer',
    min: 0
  },
  replyCount: {
    type: 'integer',
    min: 0
  }
};

export const responseReactionModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  time: {
    type: 'datetime',
  },
  reaction: {
    type: 'integer',
  }
};

export interface ResponseCommentId {
  id: string;
  author: string;
  userId: string;
}

export interface ResponseComment {
  commentId?: string;
  id: string;
  author: string;
  userId: string;
  comment: string;
  time: Date;
}

export class ResponseCommentFilter implements Filter {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  limit?: number;
}

export const responseCommentModel: Attributes = {
  commentId: {
    key: true
  },
  id: {
    required: true,
    match: 'equal'
  },
  author: {
    required: true,
    match: 'equal'
  },
  userId: {
    required: true,
    match: 'equal'
  },
  comment: {},
  time: {
    type: 'datetime'
  }
};
