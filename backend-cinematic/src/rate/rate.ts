import { Attributes, Filter, Search, Service } from 'onecore';
import { Repository } from 'query-core';

export interface RateId {
  id: string;
  author: string;
}
export interface Rate {
  id: string;
  author: string;
  rate: number;
  rateTime: Date;
  review: string;
  usefulCount: number;
  replyCount: number;
}

export interface UsefulRateId {
  id: string;
  author: string;
  userId: string;
}

export interface UsefulRate {
  id: string;
  author: string;
  userId: string;
  reviewTime: Date;
}

export interface UsefulRateFilter extends Filter {
  id?: string;
  userId?: string;
  author?: string;
  reviewTime?: Date;
}

export interface RateFilter extends Filter {
  id?: string;
  author?: string;
  rate: number;
  rateTime?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
}

export interface RateRepository extends Repository<Rate, RateId> {
  save(obj: Rate, ctx?: any): Promise<number>;
  getRate(id: string, author: string): Promise<Rate | null>;
  increaseUsefulCount(id: string, author: string, ctx?: any): Promise<number>;
  decreaseUsefulCount(id: string, author: string, ctx?: any): Promise<number>;
  increaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
  decreaseReplyCount(id: string, author: string, ctx?: any): Promise<number>;
};

export interface RateService extends Service<Rate, RateId, RateFilter> {
  getRate(id: string, author: string): Promise<Rate | null>;
  updateRate(rate: Rate): Promise<number>;
  rate(rate: Rate): Promise<boolean>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  reply(reply: Reply): Promise<boolean>;
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  updateReply(reply: Reply): Promise<number>;
}

export interface UsefulRateService extends Service<UsefulRate, UsefulRateId, UsefulRateFilter> {
  setUseful(id: string, author: string, userId: string,): Promise<number>;
}

export interface UsefulRateRepository {
  getUseful(id: string, author: string, userId: string): Promise<UsefulRate | null>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  save(obj: UsefulRate, ctx?: any): Promise<number>;
};

export interface ReplyRepository extends Repository<Reply, ReplyId> {
  getReply(id: string, author: string, userId: string): Promise<Reply | null>;
  save(obj: Reply, ctx?: any): Promise<number>;
  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  increaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  decreaseUsefulCount(id: string, author: string, userId: string, ctx?: any): Promise<number>;
}

export interface ReplyService extends Service<Reply, ReplyId, ReplyFilter> { }


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
  rateTime: {
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
}

export const usefulRateModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  reviewTime: {
    type: 'datetime',
  },
}

export const rateReactionModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userId: {
    key: true,
    required: true
  },
  author: {
    key: true,
    required: true
  },
  reviewTime: {
    type: 'datetime',
  },
  reaction: {
    type: 'integer', // 1 -> useless , 0 -> usefull //set data type min value
  }
}

export interface Info {
  id: string;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  viewCount: number;
}

export interface InfoRepository extends Repository<Info, string> {
  save(obj: Info, ctx?: any): Promise<number>;
};

export const infoModel: Attributes = {
  id: {
    key: true,
  },
  viewCount: {
    type: 'number'
  },
  rate: {
    type: 'number'
  },
  rate1: {
    type: 'number',
  },
  rate2: {
    type: 'number',
  },
  rate3: {
    type: 'number',
  },
  rate4: {
    type: 'number',
  },
  rate5: {
    type: 'number',
  },
}

export interface ReplyId {
  id: string;
  author: string;
  userId: string;
}

export interface Reply {
  id: string;
  author: string;
  userId: string;
  description: string;
  createAt: Date;
  updateAt: Date;
  usefulCount: number;
  replyCount: number;
}

export interface ReplyFilter extends Filter {
  id?: string;
  author?: string;
  userId?: string;
  description?: string;
  createAt?: Date;
  updateAt?: Date;
  usefulCount?: number;
  replyCount?: number;
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
  description: {},
  createAt: {
    type: 'datetime'
  },
  updateAt: {
    type: 'datetime'
  },
  usefulCount: {
    type: 'integer',
    min: 0
  },
  replyCount: {
    type: 'integer',
    min: 0
  }
}
