import { Attributes, Service } from 'onecore';
import { Appreciation, AppreciationFilter, UsefulAppreciation } from '../appreciation/appreciation';

export class AppreciationReplyFilter extends AppreciationFilter {
  appreciationId?: string;
}

export interface AppreciationReply extends Appreciation {
  appreciationId?: string;
}

export interface Result<T> {
  value: T;
  status: number;
}

export interface AppreciationReplyService extends Service<AppreciationReply, string, AppreciationReplyFilter> {
  insertReply: (obj: Appreciation) => Promise<Result<Appreciation>>;
  usefulAppreciation(obj: UsefulAppreciation): Promise<number>;
}
export const appreciationModel: Attributes = {
  id: {
    key: true,
    required: true,
    length: 40,
  },
  userId: {
    required: true,
    q: true
  },
  appreciationId: {
    required: true,
    q: true
  },
  authorId: {
    required: true,
    q: true
  },
  title: {
    length: 100,
    q: true
  },
  description: {
    length: 255,
    q: true
  },
  createdAt: {
    type: 'datetime',
    q: true
  },
  usefulCount: {
    length: 20,
    q: true
  }
};
