import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface RateId {
  id: string;
  author: string;
}

export interface Rate extends Tracking {
  id?: string;
  author?: string;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
}

export class RateFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  id?: string;
  author?: string;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  limit?: number;
}

export interface RateReactionId {
  id: string;
  author: string;
  userId: string;
}

export interface RateReaction {
  id?: string;
  author?: string;
  userId: string;
  reviewTime: Date;
  reaction: number;
}

export interface RateReactionFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  reviewTime?: Date;
  reaction?: number;
}

export interface RateService extends Service<Rate, string, RateFilter> {
  getRate(obj: Rate): Promise<Rate[]>;
  updateRate(rate: Rate): Promise<number>;
  rate(obj: Rate): Promise<any>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  comment(comment: RateComment): Promise<boolean>;
  removeComment(commentId: string, author: string, ctx?: any): Promise<number>;
  updateComment(comment: RateComment): Promise<number>;
  getCommentSearch(obj: Rate, ctx?: any): Promise<RateComment[]>;
}

export interface RateCommentService extends Service<RateComment, string, RateCommentFilter> {

}

export const rateModel: Attributes = {
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
  rate: {
    type: 'integer',
    min: 1,
    max: 5
  },
  time: {
    type: 'datetime',
  },
  review: {
    q: true,
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

export const rateReactionModel: Attributes = {
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

export interface RateCommentId {
  id: string;
  author: string;
  userId: string;
}

export interface RateComment {
  commentId?: string;
  id: string;
  author: string;
  userId: string;
  comment: string;
  time: Date;
}

export class RateCommentFilter implements Filter {
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

export const rateCommentModel: Attributes = {
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
