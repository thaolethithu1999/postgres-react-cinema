import { Attributes, Filter, Service, Tracking, NumberRange } from 'onecore';

export interface ItemFilter extends Filter {
  id: string;
  title: string;
  status: string;
  description: string;
  categories: string[];
  brand: string[];
  price: NumberRange;
}
export interface Item extends Tracking {
  id: string;
  title: string;
  status: string;
  imageURL: string;
  description: string;
  categories: string[];
  brand: string;
  price: number;
  info?: Info;
}

export interface Info {
  viewCount: number;
}

export interface ItemResponse {
  id?: string;
  userId: string;
  description: string;
  time?: Date;
  usefulCount?: number;
  isUseful?: boolean;
}

export interface ItemResponseFilter extends Filter {
  id?: string;
  description?: string;
  userId?: string;
 time?: Date;
}
export interface UsefulItem {
  updatedat?: Date|string;
  createdat?: Date|string;
  id: string;
  author: string;
}

export const itemModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  title: {
    length: 100,
    required: true,
    q: true
  },
  imageURL: {
    length: 1500,
  },
  description: {
    length: 1000,
    q: true
  },
  status: {
    length: 1,
    required: true,
    q: true
  },
  categories: {
    type: 'primitives',
  },
  brand: {
    type: 'string',
    length: 100,
  },
  price: {
  },
};

export const itemResponseModel: Attributes = {
  id: {
    key: true,
    required: true
  },
  userId: {
  },
  description: {
    q: true,
  },
 time: {
    type: 'datetime',
  },
};

export interface ItemService extends Service<Item, string, ItemFilter> {
  getItem(id: string | undefined): Promise<Item | null>;
  updateItem(item: Item, id: string): Promise<Item | null>;
  saveItem(item: Item): Promise<number>;
  responseItem(obj: ItemResponse): Promise<any>;
}

export interface ItemResponseService extends Service<ItemResponse, string, ItemResponseFilter> {
  usefulItem(obj: UsefulItem): Promise<number>;
  usefulSearch(obj: UsefulItem): Promise<number>;
}

export interface BrandService {
  getBrand(q: string, max?: number): Promise<string[] | null>;
}