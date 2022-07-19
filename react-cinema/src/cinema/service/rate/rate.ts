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
  reply?: Reply[];
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
  reply?: Reply[];
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
  reply(reply: Reply): Promise<boolean>;
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  updateReply(reply: Reply): Promise<number>;
  getReplySearch(obj: Rate, ctx?: any): Promise<Reply[]>;
}

export interface ReplyService extends Service<Reply, string, ReplyFilter> {

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

export interface ReplyId {
  id: string;
  author: string;
  userId: string;
}

export interface Reply {
  id?: string;
  author?: string;
  userId?: string;
  review?: string;
  time?: Date;
}

export class ReplyFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  id?: string;
  author?: string;
  userId?: string;
  review?: string;
  time?: Date;
  limit?: number;
}

export const replyModel: Attributes = {
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
  userId: {
    key: true,
    required: true,
    match: 'equal'
  },
  review: {},
  time: {
    type: 'datetime'
  }
};
