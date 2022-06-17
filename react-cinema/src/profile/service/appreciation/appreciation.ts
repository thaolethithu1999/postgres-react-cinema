import { Attributes, Filter, Service } from 'onecore';

export class AppreciationFilter implements Filter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  limit?: number;
  id?: string;
  title?: string;
  description?: string;
  createdAt?: Date|string;
  authorId?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  userIdUseful?: string;
}

export interface Appreciation {
  id?: string;
  title: string;
  description: string;
  createdAt?: Date|string;
  authorId: string;
  usefulCount: number;
  replyCount: number;
  userId: string;
  isUseful?: boolean;
}


export interface UsefulAppreciation {
  id?: string;
  updatedAt?: Date|string;
  createdAt?: Date|string;
  userId: string;
  appreciationId: string;
}
export interface AppreciationService extends Service<Appreciation, string, AppreciationFilter> {
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
